// Users API Routes
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateUser, validateRequest } from '../utils/middleware';

export const usersRoutes: Router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  company: z.string().optional(),
  timezone: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark']).optional(),
    language: z.string().optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      documentProcessed: z.boolean().optional(),
      riskAlerts: z.boolean().optional()
    }).optional()
  }).optional()
});

// GET /users/profile - Get user profile
usersRoutes.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;

    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User profile not found'
        }
      });
    }

    const userData = userDoc.data();
    
    // Remove sensitive data
    const { password, ...publicProfile } = userData as any;

    return res.status(200).json({
      success: true,
      data: {
        id: userDoc.id,
        ...publicProfile
      }
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_PROFILE_ERROR',
        message: 'Failed to retrieve user profile'
      }
    });
  }
});

// PUT /users/profile - Update user profile
usersRoutes.put('/profile', 
  authenticateUser, 
  validateRequest(updateProfileSchema), 
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const updates = req.body;

      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User profile not found'
          }
        });
      }

      // Update Firestore profile
      const updateData = {
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Handle nested updates properly
      if (updates.preferences) {
        const currentData = userDoc.data();
        updateData.preferences = {
          ...(currentData?.preferences || {}),
          ...updates.preferences
        };
      }

      await userRef.update(updateData);

      // Update Firebase Auth displayName if provided
      if (updates.displayName) {
        await admin.auth().updateUser(userId, {
          displayName: updates.displayName
        });
      }

      // Get updated profile
      const updatedDoc = await userRef.get();
      const updatedData = updatedDoc.data();

      return res.status(200).json({
        success: true,
        data: {
          id: updatedDoc.id,
          ...updatedData
        }
      });

    } catch (error: any) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_PROFILE_ERROR',
          message: 'Failed to update user profile'
        }
      });
    }
  }
);

// GET /users/stats - Get user statistics
usersRoutes.get('/stats', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;

    // Get document count
    const documentsQuery = admin.firestore()
      .collection('documents')
      .where('userId', '==', userId);
    const documentsSnapshot = await documentsQuery.count().get();
    const totalDocuments = documentsSnapshot.data().count;

    // Get processed documents count
    const processedQuery = admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .where('status', '==', 'processed');
    const processedSnapshot = await processedQuery.count().get();
    const processedDocuments = processedSnapshot.data().count;

    // Get Q&A sessions count
    const qaQuery = admin.firestore()
      .collection('qa_sessions')
      .where('userId', '==', userId);
    const qaSnapshot = await qaQuery.count().get();
    const totalQuestions = qaSnapshot.data().count;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDocsQuery = admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo));
    const recentDocsSnapshot = await recentDocsQuery.count().get();
    const recentDocuments = recentDocsSnapshot.data().count;

    // Get subscription info
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const userData = userDoc.data();
    const subscription = userData?.subscription || 'free';

    const stats = {
      documents: {
        total: totalDocuments,
        processed: processedDocuments,
        pending: totalDocuments - processedDocuments,
        recent: recentDocuments
      },
      activity: {
        totalQuestions,
        averageQuestionsPerDocument: totalDocuments > 0 ? Math.round(totalQuestions / totalDocuments * 100) / 100 : 0
      },
      subscription: {
        plan: subscription,
        isActive: userData?.isActive || false
      },
      usage: {
        storageUsed: userData?.usage?.storageUsed || 0,
        apiCalls: userData?.usage?.apiCalls || 0,
        documentsThisMonth: userData?.usage?.documentsThisMonth || 0
      }
    };

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_STATS_ERROR',
        message: 'Failed to retrieve user statistics'
      }
    });
  }
});

// GET /users/activity - Get user activity history
usersRoutes.get('/activity', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const { limit = 50, offset = 0, type } = req.query;

    // Get recent documents
    let documentsQuery = admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(Number(limit));

    if (offset) {
      documentsQuery = documentsQuery.offset(Number(offset));
    }

    const documentsSnapshot = await documentsQuery.get();
    const documents = documentsSnapshot.docs.map(doc => ({
      type: 'document',
      action: 'uploaded',
      id: doc.id,
      title: doc.data().fileName,
      timestamp: doc.data().createdAt,
      status: doc.data().status
    }));

    // Get recent Q&A sessions
    let qaQuery = admin.firestore()
      .collection('qa_sessions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(Number(limit));

    const qaSnapshot = await qaQuery.get();
    const qaActivity = qaSnapshot.docs.map(doc => ({
      type: 'question',
      action: 'asked',
      id: doc.id,
      title: doc.data().question.text.substring(0, 100) + '...',
      timestamp: doc.data().createdAt,
      documentId: doc.data().documentId
    }));

    // Combine and sort activities
    let allActivity = [...documents, ...qaActivity];
    allActivity.sort((a, b) => b.timestamp - a.timestamp);

    // Filter by type if specified
    if (type && typeof type === 'string') {
      allActivity = allActivity.filter(item => item.type === type);
    }

    return res.status(200).json({
      success: true,
      data: {
        activity: allActivity.slice(0, Number(limit)),
        hasMore: allActivity.length > Number(limit)
      }
    });

  } catch (error: any) {
    console.error('Get activity error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_ACTIVITY_ERROR',
        message: 'Failed to retrieve user activity'
      }
    });
  }
});

// DELETE /users/account - Delete user account
usersRoutes.delete('/account', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;

    // Get all user documents
    const documentsSnapshot = await admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .get();

    // Delete all user documents and their files
    const batch = admin.firestore().batch();
    const bucket = admin.storage().bucket();

    for (const doc of documentsSnapshot.docs) {
      const docData = doc.data();
      
      // Delete file from storage
      const filePath = `documents/${userId}/${doc.id}/${docData.fileName}`;
      try {
        await bucket.file(filePath).delete();
      } catch (storageError) {
        console.warn('File not found in storage:', filePath);
      }

      // Mark document for deletion
      batch.delete(doc.ref);
    }

    // Delete all Q&A sessions
    const qaSnapshot = await admin.firestore()
      .collection('qa_sessions')
      .where('userId', '==', userId)
      .get();

    qaSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete all analysis records
    const analysisSnapshot = await admin.firestore()
      .collection('analysis')
      .where('userId', '==', userId)
      .get();

    analysisSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Commit batch deletions
    await batch.commit();

    // Delete user profile
    await admin.firestore().collection('users').doc(userId).delete();

    // Delete Firebase Auth user
    await admin.auth().deleteUser(userId);

    return res.status(200).json({
      success: true,
      data: {
        message: 'Account deleted successfully'
      }
    });

  } catch (error: any) {
    console.error('Delete account error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_ACCOUNT_ERROR',
        message: 'Failed to delete account'
      }
    });
  }
});

// POST /users/export-data - Export user data
usersRoutes.post('/export-data', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;

    // Get user profile
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    const userData = userDoc.exists ? userDoc.data() : {};

    // Get all documents
    const documentsSnapshot = await admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .get();

    const documents = documentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get all Q&A sessions
    const qaSnapshot = await admin.firestore()
      .collection('qa_sessions')
      .where('userId', '==', userId)
      .get();

    const qaSessions = qaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get all analysis records
    const analysisSnapshot = await admin.firestore()
      .collection('analysis')
      .where('userId', '==', userId)
      .get();

    const analyses = analysisSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const exportData = {
      profile: userData,
      documents,
      qaSessions,
      analyses,
      exportedAt: new Date().toISOString(),
      exportedBy: userId
    };

    return res.status(200).json({
      success: true,
      data: exportData
    });

  } catch (error: any) {
    console.error('Export data error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_DATA_ERROR',
        message: 'Failed to export user data'
      }
    });
  }
});
