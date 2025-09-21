// Firebase Triggers for automated processes
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Firestore Triggers

// User creation trigger - set up default preferences
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const userProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role: 'user',
      subscription: 'free',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          documentProcessed: true,
          riskAlerts: true
        }
      },
      profile: {
        firstName: '',
        lastName: '',
        company: '',
        timezone: 'America/New_York'
      },
      usage: {
        storageUsed: 0,
        apiCalls: 0,
        documentsThisMonth: 0,
        lastResetDate: admin.firestore.FieldValue.serverTimestamp()
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    };

    await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .set(userProfile);

    console.log(`User profile created for ${user.uid}`);
    
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
});

// User deletion trigger - cleanup user data
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    const userId = user.uid;
    const batch = admin.firestore().batch();

    // Delete user profile
    const userRef = admin.firestore().collection('users').doc(userId);
    batch.delete(userRef);

    // Delete all user documents
    const documentsSnapshot = await admin.firestore()
      .collection('documents')
      .where('userId', '==', userId)
      .get();

    documentsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

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

    await batch.commit();

    console.log(`Cleaned up data for deleted user ${userId}`);
    
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
});

// Document upload completion trigger - start processing
export const onDocumentUpload = functions.storage.object().onFinalize(async (object) => {
  try {
    const { name: filePath, contentType, size } = object;
    
    if (!filePath || !filePath.startsWith('documents/')) {
      return; // Not a document upload
    }

    // Parse file path: documents/{userId}/{documentId}/{fileName}
    const pathParts = filePath.split('/');
    if (pathParts.length !== 4) {
      console.warn('Invalid document path:', filePath);
      return;
    }

    const [, userId, documentId, fileName] = pathParts;

    if (!documentId) {
      console.warn('Missing document ID in path:', filePath);
      return;
    }

    // Update document status to uploaded
    const docRef = admin.firestore().collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.warn('Document not found:', documentId);
      return;
    }

    await docRef.update({
      status: 'uploaded',
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      fileInfo: {
        path: filePath,
        contentType,
        size: size || 0
      },
      processing: {
        status: 'queued',
        startedAt: null,
        completedAt: null,
        error: null
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Queue for processing (in a real implementation, this would trigger document processing)
    console.log(`Document ${documentId} uploaded and queued for processing`);

  } catch (error) {
    console.error('Error handling document upload:', error);
  }
});

// Document status change trigger - send notifications
export const onDocumentStatusChange = functions.firestore
  .document('documents/{documentId}')
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      const documentId = context.params.documentId;

      // Check if status changed
      if (beforeData.status === afterData.status) {
        return; // No status change
      }

      const userId = afterData.userId;
      const fileName = afterData.fileName;
      const newStatus = afterData.status;

      // Get user preferences for notifications
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        return;
      }

      const userData = userDoc.data();
      const notificationPrefs = userData?.preferences?.notifications || {};

      // Send notification based on status
      if (newStatus === 'processed' && notificationPrefs.documentProcessed) {
        await sendProcessingCompleteNotification(userId, documentId, fileName);
      } else if (newStatus === 'error') {
        await sendProcessingErrorNotification(userId, documentId, fileName, afterData.processing?.error);
      }

      // Update user usage statistics
      if (newStatus === 'processed') {
        await admin.firestore()
          .collection('users')
          .doc(userId)
          .update({
            'usage.apiCalls': admin.firestore.FieldValue.increment(1),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
      }

    } catch (error) {
      console.error('Error handling document status change:', error);
    }
  });

// Risk alert trigger - monitor high-risk documents
export const onRiskAnalysis = functions.firestore
  .document('analysis/{analysisId}')
  .onCreate(async (snapshot, context) => {
    try {
      const analysisData = snapshot.data();
      const analysisId = context.params.analysisId;
      
      if (!analysisData.result?.risks) {
        return; // No risks to analyze
      }

      const risks = analysisData.result.risks;
      const highRisks = risks.filter((risk: any) => risk.severity === 'high');

      if (highRisks.length === 0) {
        return; // No high risks
      }

      const userId = analysisData.userId;
      const documentId = analysisData.documentId;

      // Get user notification preferences
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        return;
      }

      const userData = userDoc.data();
      const notificationPrefs = userData?.preferences?.notifications || {};

      if (notificationPrefs.riskAlerts) {
        await sendRiskAlertNotification(userId, documentId, highRisks);
      }

      // Create risk alert record
      await admin.firestore()
        .collection('risk_alerts')
        .add({
          userId,
          documentId,
          analysisId,
          riskCount: highRisks.length,
          risks: highRisks,
          notified: notificationPrefs.riskAlerts,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
      console.error('Error handling risk analysis:', error);
    }
  });

// Helper functions for notifications
async function sendProcessingCompleteNotification(userId: string, documentId: string, fileName: string): Promise<void> {
  try {
    // Create notification record
    await admin.firestore()
      .collection('notifications')
      .add({
        userId,
        type: 'document_processed',
        title: 'Document Processing Complete',
        message: `Your document "${fileName}" has been successfully processed and is ready for analysis.`,
        data: {
          documentId,
          fileName,
          action: 'view_document'
        },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(`Processing complete notification sent to user ${userId}`);

  } catch (error) {
    console.error('Error sending processing complete notification:', error);
  }
}

async function sendProcessingErrorNotification(userId: string, documentId: string, fileName: string, errorMessage?: string): Promise<void> {
  try {
    // Create notification record
    await admin.firestore()
      .collection('notifications')
      .add({
        userId,
        type: 'processing_error',
        title: 'Document Processing Failed',
        message: `There was an error processing your document "${fileName}". Please try uploading again or contact support.`,
        data: {
          documentId,
          fileName,
          error: errorMessage,
          action: 'retry_processing'
        },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(`Processing error notification sent to user ${userId}`);

  } catch (error) {
    console.error('Error sending processing error notification:', error);
  }
}

async function sendRiskAlertNotification(userId: string, documentId: string, risks: any[]): Promise<void> {
  try {
    const riskCount = risks.length;
    const riskTypes = risks.map(r => r.type).join(', ');

    // Create notification record
    await admin.firestore()
      .collection('notifications')
      .add({
        userId,
        type: 'risk_alert',
        title: 'High Risk Issues Detected',
        message: `We found ${riskCount} high-risk issue${riskCount > 1 ? 's' : ''} in your document: ${riskTypes}. Review recommended immediately.`,
        data: {
          documentId,
          riskCount,
          risks,
          action: 'view_risks'
        },
        read: false,
        priority: 'high',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(`Risk alert notification sent to user ${userId} for ${riskCount} high risks`);

  } catch (error) {
    console.error('Error sending risk alert notification:', error);
  }
}