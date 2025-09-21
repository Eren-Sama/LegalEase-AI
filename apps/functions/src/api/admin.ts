// Admin API Routes
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateAdmin, validateRequest } from '../utils/middleware';

export const adminRoutes: Router = Router();

// Validation schemas
const updateUserSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  subscription: z.enum(['free', 'premium', 'enterprise']).optional(),
  isActive: z.boolean().optional()
});

// GET /admin/stats - Get system statistics
adminRoutes.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Get user statistics
    const totalUsersSnapshot = await admin.firestore().collection('users').count().get();
    const totalUsers = totalUsersSnapshot.data().count;

    const activeUsersSnapshot = await admin.firestore()
      .collection('users')
      .where('isActive', '==', true)
      .count().get();
    const activeUsers = activeUsersSnapshot.data().count;

    // Get subscription statistics
    const subscriptionStats = await Promise.all([
      admin.firestore().collection('users').where('subscription', '==', 'free').count().get(),
      admin.firestore().collection('users').where('subscription', '==', 'premium').count().get(),
      admin.firestore().collection('users').where('subscription', '==', 'enterprise').count().get()
    ]);

    const subscriptions = {
      free: subscriptionStats[0].data().count,
      premium: subscriptionStats[1].data().count,
      enterprise: subscriptionStats[2].data().count
    };

    // Get document statistics
    const totalDocsSnapshot = await admin.firestore().collection('documents').count().get();
    const totalDocuments = totalDocsSnapshot.data().count;

    const processedDocsSnapshot = await admin.firestore()
      .collection('documents')
      .where('status', '==', 'processed')
      .count().get();
    const processedDocuments = processedDocsSnapshot.data().count;

    // Get recent activity (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const dayAgoTimestamp = admin.firestore.Timestamp.fromDate(oneDayAgo);

    const recentActivity = await Promise.all([
      admin.firestore().collection('users').where('createdAt', '>=', dayAgoTimestamp).count().get(),
      admin.firestore().collection('documents').where('createdAt', '>=', dayAgoTimestamp).count().get(),
      admin.firestore().collection('qa_sessions').where('createdAt', '>=', dayAgoTimestamp).count().get()
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        newToday: recentActivity[0].data().count
      },
      subscriptions,
      documents: {
        total: totalDocuments,
        processed: processedDocuments,
        pending: totalDocuments - processedDocuments,
        newToday: recentActivity[1].data().count,
        processingRate: totalDocuments > 0 ? Math.round((processedDocuments / totalDocuments) * 100) : 0
      },
      activity: {
        questionsToday: recentActivity[2].data().count,
        averageQuestionsPerUser: activeUsers > 0 ? Math.round((recentActivity[2].data().count / activeUsers) * 100) / 100 : 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_STATS_ERROR',
        message: 'Failed to retrieve system statistics'
      }
    });
  }
});

// GET /admin/users - Get all users with pagination
adminRoutes.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      role, 
      subscription, 
      isActive,
      search 
    } = req.query;

    let query: admin.firestore.Query = admin.firestore().collection('users');

    // Apply filters
    if (role && typeof role === 'string') {
      query = query.where('role', '==', role);
    }

    if (subscription && typeof subscription === 'string') {
      query = query.where('subscription', '==', subscription);
    }

    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive === 'true');
    }

    // Apply ordering and pagination
    query = query.orderBy('createdAt', 'desc')
                 .limit(Number(limit))
                 .offset(Number(offset));

    const usersSnapshot = await query.get();
    let users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter if provided
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      users = users.filter((user: any) =>
        user.email?.toLowerCase().includes(searchTerm) ||
        user.displayName?.toLowerCase().includes(searchTerm) ||
        user.profile?.firstName?.toLowerCase().includes(searchTerm) ||
        user.profile?.lastName?.toLowerCase().includes(searchTerm)
      );
    }

    // Get total count for pagination
    const totalSnapshot = await admin.firestore().collection('users').count().get();
    const total = totalSnapshot.data().count;

    res.status(200).json({
      success: true,
      data: {
        users: users.map((user: any) => ({
          ...user,
          // Remove sensitive data
          password: undefined
        })),
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + users.length < total
        }
      }
    });

  } catch (error: any) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_GET_USERS_ERROR',
        message: 'Failed to retrieve users'
      }
    });
  }
});

// PUT /admin/users/:userId - Update user account
adminRoutes.put('/users/:userId',
  authenticateAdmin,
  validateRequest(updateUserSchema),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_USER_ID',
            message: 'User ID is required'
          }
        });
      }
      const updates = req.body;

      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      // Update user profile
      await userRef.update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Get updated user data
      const updatedDoc = await userRef.get();
      const updatedData = updatedDoc.data();

      return res.status(200).json({
        success: true,
        data: {
          id: updatedDoc.id,
          ...updatedData,
          password: undefined // Remove sensitive data
        }
      });

    } catch (error: any) {
      console.error('Admin update user error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'ADMIN_UPDATE_USER_ERROR',
          message: 'Failed to update user'
        }
      });
    }
  }
);

// GET /admin/documents - Get all documents with advanced filtering
adminRoutes.get('/documents', authenticateAdmin, async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      status, 
      userId,
      dateFrom,
      dateTo 
    } = req.query;

    let query: admin.firestore.Query = admin.firestore().collection('documents');

    // Apply filters
    if (status && typeof status === 'string') {
      query = query.where('status', '==', status);
    }

    if (userId && typeof userId === 'string') {
      query = query.where('userId', '==', userId);
    }

    if (dateFrom && typeof dateFrom === 'string') {
      const fromDate = admin.firestore.Timestamp.fromDate(new Date(dateFrom));
      query = query.where('createdAt', '>=', fromDate);
    }

    if (dateTo && typeof dateTo === 'string') {
      const toDate = admin.firestore.Timestamp.fromDate(new Date(dateTo));
      query = query.where('createdAt', '<=', toDate);
    }

    // Apply ordering and pagination
    query = query.orderBy('createdAt', 'desc')
                 .limit(Number(limit))
                 .offset(Number(offset));

    const documentsSnapshot = await query.get();
    const documents = documentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get user information for each document
    const enrichedDocuments = await Promise.all(
      documents.map(async (doc: any) => {
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(doc.userId)
          .get();
        
        const userData = userDoc.exists ? userDoc.data() : null;
        
        return {
          ...doc,
          user: userData ? {
            email: userData.email,
            displayName: userData.displayName,
            subscription: userData.subscription
          } : null
        };
      })
    );

    // Get total count
    const totalSnapshot = await admin.firestore().collection('documents').count().get();
    const total = totalSnapshot.data().count;

    res.status(200).json({
      success: true,
      data: {
        documents: enrichedDocuments,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + documents.length < total
        }
      }
    });

  } catch (error: any) {
    console.error('Admin get documents error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_GET_DOCUMENTS_ERROR',
        message: 'Failed to retrieve documents'
      }
    });
  }
});

// DELETE /admin/documents/:documentId - Delete document (admin)
adminRoutes.delete('/documents/:documentId', authenticateAdmin, async (req, res) => {
  try {
    const documentId = req.params.documentId;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    const docRef = admin.firestore().collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: 'Document not found'
        }
      });
    }

    const documentData = docSnapshot.data();

    // Delete file from storage
    const bucket = admin.storage().bucket();
    const filePath = `documents/${documentData?.userId}/${documentId}/${documentData?.fileName}`;
    
    try {
      await bucket.file(filePath).delete();
    } catch (storageError) {
      console.warn('File not found in storage:', filePath);
    }

    // Delete related records
    const batch = admin.firestore().batch();

    // Delete document
    batch.delete(docRef);

    // Delete related Q&A sessions
    const qaSnapshot = await admin.firestore()
      .collection('qa_sessions')
      .where('documentId', '==', documentId)
      .get();

    qaSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete related analysis records
    const analysisSnapshot = await admin.firestore()
      .collection('analysis')
      .where('documentId', '==', documentId)
      .get();

    analysisSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return res.status(200).json({
      success: true,
      data: {
        message: 'Document and related data deleted successfully'
      }
    });

  } catch (error: any) {
    console.error('Admin delete document error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_DELETE_DOCUMENT_ERROR',
        message: 'Failed to delete document'
      }
    });
  }
});

// GET /admin/analytics - Get detailed analytics
adminRoutes.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { period = 'week', startDate, endDate } = req.query;

    let start: Date;
    let end: Date = new Date();

    // Calculate date range based on period
    switch (period) {
      case 'day':
        start = new Date();
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate as string);
          end = new Date(endDate as string);
        } else {
          start = new Date();
          start.setDate(start.getDate() - 7);
        }
        break;
      default:
        start = new Date();
        start.setDate(start.getDate() - 7);
    }

    const startTimestamp = admin.firestore.Timestamp.fromDate(start);
    const endTimestamp = admin.firestore.Timestamp.fromDate(end);

    // Get analytics data
    const [
      newUsers,
      newDocuments,
      processedDocuments,
      qaActivity,
      errorDocuments
    ] = await Promise.all([
      admin.firestore()
        .collection('users')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .count().get(),
      
      admin.firestore()
        .collection('documents')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .count().get(),
      
      admin.firestore()
        .collection('documents')
        .where('status', '==', 'processed')
        .where('updatedAt', '>=', startTimestamp)
        .where('updatedAt', '<=', endTimestamp)
        .count().get(),
      
      admin.firestore()
        .collection('qa_sessions')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .count().get(),
      
      admin.firestore()
        .collection('documents')
        .where('status', '==', 'error')
        .where('updatedAt', '>=', startTimestamp)
        .where('updatedAt', '<=', endTimestamp)
        .count().get()
    ]);

    const analytics = {
      period,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      metrics: {
        newUsers: newUsers.data().count,
        newDocuments: newDocuments.data().count,
        processedDocuments: processedDocuments.data().count,
        errorDocuments: errorDocuments.data().count,
        qaActivity: qaActivity.data().count,
        processingSuccessRate: newDocuments.data().count > 0 
          ? Math.round((processedDocuments.data().count / newDocuments.data().count) * 100) 
          : 0,
        errorRate: newDocuments.data().count > 0 
          ? Math.round((errorDocuments.data().count / newDocuments.data().count) * 100) 
          : 0
      }
    };

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error: any) {
    console.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_ANALYTICS_ERROR',
        message: 'Failed to retrieve analytics'
      }
    });
  }
});

// POST /admin/broadcast - Send system-wide notification
adminRoutes.post('/broadcast', authenticateAdmin, async (req, res) => {
  try {
    const { title, message, type = 'info', targetUsers } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'Title and message are required'
        }
      });
    }

    // Get target users
    let userQuery: admin.firestore.Query = admin.firestore().collection('users');
    
    if (targetUsers && targetUsers.length > 0) {
      // Send to specific users
      userQuery = userQuery.where(admin.firestore.FieldPath.documentId(), 'in', targetUsers);
    } else {
      // Send to all active users
      userQuery = userQuery.where('isActive', '==', true);
    }

    const usersSnapshot = await userQuery.get();
    
    if (usersSnapshot.empty) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_TARGET_USERS',
          message: 'No target users found'
        }
      });
    }

    // Create notifications for all users
    const batch = admin.firestore().batch();
    let notificationCount = 0;

    usersSnapshot.docs.forEach(userDoc => {
      const notificationRef = admin.firestore().collection('notifications').doc();
      batch.set(notificationRef, {
        userId: userDoc.id,
        type,
        title,
        message,
        data: {
          source: 'system_broadcast',
          broadcastId: `broadcast_${Date.now()}`
        },
        read: false,
        priority: type === 'urgent' ? 'high' : 'normal',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      notificationCount++;
    });

    await batch.commit();

    return res.status(200).json({
      success: true,
      data: {
        message: 'Broadcast notification sent successfully',
        recipientCount: notificationCount
      }
    });

  } catch (error: any) {
    console.error('Admin broadcast error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_BROADCAST_ERROR',
        message: 'Failed to send broadcast notification'
      }
    });
  }
});