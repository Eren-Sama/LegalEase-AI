// Scheduled Functions for maintenance and analytics
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Daily cleanup of expired sessions and temporary files
export const dailyCleanup = functions.pubsub
  .schedule('0 2 * * *') // Run at 2 AM every day
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      console.log('Starting daily cleanup...');

      // Clean up expired upload URLs (older than 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const expiredUploadsQuery = admin.firestore()
        .collection('documents')
        .where('status', '==', 'uploading')
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(oneDayAgo));

      const expiredUploads = await expiredUploadsQuery.get();
      
      if (!expiredUploads.empty) {
        const batch = admin.firestore().batch();
        
        expiredUploads.docs.forEach(doc => {
          batch.update(doc.ref, {
            status: 'expired',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        });

        await batch.commit();
        console.log(`Marked ${expiredUploads.docs.length} uploads as expired`);
      }

      // Clean up old notifications (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldNotificationsQuery = admin.firestore()
        .collection('notifications')
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo));

      const oldNotifications = await oldNotificationsQuery.get();

      if (!oldNotifications.empty) {
        const batch = admin.firestore().batch();
        
        oldNotifications.docs.forEach(doc => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`Deleted ${oldNotifications.docs.length} old notifications`);
      }

      // Clean up temporary files in storage
      await cleanupTemporaryFiles();

      console.log('Daily cleanup completed successfully');
      return null;

    } catch (error) {
      console.error('Error during daily cleanup:', error);
      throw error;
    }
  });

// Weekly usage analytics and reporting
export const weeklyAnalytics = functions.pubsub
  .schedule('0 9 * * 1') // Run at 9 AM every Monday
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      console.log('Starting weekly analytics...');

      // Calculate weekly stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekStart = admin.firestore.Timestamp.fromDate(oneWeekAgo);

      // Get new users this week
      const newUsersQuery = admin.firestore()
        .collection('users')
        .where('createdAt', '>=', weekStart);
      const newUsersSnapshot = await newUsersQuery.count().get();
      const newUsers = newUsersSnapshot.data().count;

      // Get new documents this week
      const newDocsQuery = admin.firestore()
        .collection('documents')
        .where('createdAt', '>=', weekStart);
      const newDocsSnapshot = await newDocsQuery.count().get();
      const newDocuments = newDocsSnapshot.data().count;

      // Get processed documents this week
      const processedQuery = admin.firestore()
        .collection('documents')
        .where('status', '==', 'processed')
        .where('updatedAt', '>=', weekStart);
      const processedSnapshot = await processedQuery.count().get();
      const processedDocuments = processedSnapshot.data().count;

      // Get Q&A activity this week
      const qaQuery = admin.firestore()
        .collection('qa_sessions')
        .where('createdAt', '>=', weekStart);
      const qaSnapshot = await qaQuery.count().get();
      const qaActivity = qaSnapshot.data().count;

      // Create analytics record
      const analytics = {
        period: 'weekly',
        startDate: weekStart,
        endDate: admin.firestore.FieldValue.serverTimestamp(),
        metrics: {
          newUsers,
          newDocuments,
          processedDocuments,
          qaActivity,
          processingSuccessRate: newDocuments > 0 ? Math.round((processedDocuments / newDocuments) * 100) : 0
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await admin.firestore()
        .collection('analytics')
        .add(analytics);

      console.log('Weekly analytics completed:', analytics.metrics);
      return null;

    } catch (error) {
      console.error('Error during weekly analytics:', error);
      throw error;
    }
  });

// Monthly usage reset for free tier users
export const monthlyUsageReset = functions.pubsub
  .schedule('0 0 1 * *') // Run at midnight on the 1st of each month
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      console.log('Starting monthly usage reset...');

      // Reset usage for free tier users
      const freeUsersQuery = admin.firestore()
        .collection('users')
        .where('subscription', '==', 'free');

      const freeUsersSnapshot = await freeUsersQuery.get();
      
      if (!freeUsersSnapshot.empty) {
        const batch = admin.firestore().batch();
        
        freeUsersSnapshot.docs.forEach(doc => {
          batch.update(doc.ref, {
            'usage.documentsThisMonth': 0,
            'usage.apiCalls': 0,
            'usage.lastResetDate': admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        });

        await batch.commit();
        console.log(`Reset usage for ${freeUsersSnapshot.docs.length} free users`);
      }

      // Generate monthly report
      await generateMonthlyReport();

      console.log('Monthly usage reset completed');
      return null;

    } catch (error) {
      console.error('Error during monthly usage reset:', error);
      throw error;
    }
  });

// Hourly health check
export const healthCheck = functions.pubsub
  .schedule('0 * * * *') // Run every hour
  .onRun(async (context) => {
    try {
      // Check Firebase services
      const healthStatus = {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        services: {
          firestore: false,
          storage: false,
          auth: false
        },
        errors: [] as string[]
      };

      // Test Firestore
      try {
        await admin.firestore().collection('_health').doc('test').set({
          test: true,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        healthStatus.services.firestore = true;
      } catch (error: any) {
        healthStatus.errors.push(`Firestore: ${error.message}`);
      }

      // Test Storage
      try {
        const bucket = admin.storage().bucket();
        const testFile = bucket.file('_health/test.txt');
        await testFile.save('health check test');
        await testFile.delete();
        healthStatus.services.storage = true;
      } catch (error: any) {
        healthStatus.errors.push(`Storage: ${error.message}`);
      }

      // Test Auth
      try {
        await admin.auth().listUsers(1);
        healthStatus.services.auth = true;
      } catch (error: any) {
        healthStatus.errors.push(`Auth: ${error.message}`);
      }

      // Save health check results
      await admin.firestore()
        .collection('_system_health')
        .add(healthStatus);

      // Alert if any services are down
      if (healthStatus.errors.length > 0) {
        console.error('Health check failed:', healthStatus.errors);
        // In a real implementation, this would send alerts to administrators
      }

      return null;

    } catch (error) {
      console.error('Error during health check:', error);
      throw error;
    }
  });

// Auto-archive old documents (enterprise feature)
export const autoArchive = functions.pubsub
  .schedule('0 3 * * 0') // Run at 3 AM every Sunday
  .onRun(async (context) => {
    try {
      console.log('Starting auto-archive process...');

      // Archive documents older than 1 year for non-enterprise users
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const oldDocsQuery = admin.firestore()
        .collection('documents')
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(oneYearAgo));

      const oldDocsSnapshot = await oldDocsQuery.get();
      let archivedCount = 0;

      if (!oldDocsSnapshot.empty) {
        const batch = admin.firestore().batch();

        for (const doc of oldDocsSnapshot.docs) {
          const docData = doc.data();
          
          // Check if user has enterprise subscription
          const userDoc = await admin.firestore()
            .collection('users')
            .doc(docData.userId)
            .get();

          const userData = userDoc.data();
          if (userData?.subscription === 'enterprise') {
            continue; // Skip enterprise users
          }

          // Archive the document
          batch.update(doc.ref, {
            status: 'archived',
            archivedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          archivedCount++;
        }

        if (archivedCount > 0) {
          await batch.commit();
          console.log(`Archived ${archivedCount} old documents`);
        }
      }

      return null;

    } catch (error) {
      console.error('Error during auto-archive:', error);
      throw error;
    }
  });

// Helper functions
async function cleanupTemporaryFiles(): Promise<void> {
  try {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({
      prefix: 'temp/',
      delimiter: '/'
    });

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    let deletedCount = 0;

    for (const file of files) {
      const [metadata] = await file.getMetadata();
      const created = new Date(metadata.timeCreated);

      if (created < oneDayAgo) {
        await file.delete();
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} temporary files`);
    }

  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
}

async function generateMonthlyReport(): Promise<void> {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const monthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

    const startTimestamp = admin.firestore.Timestamp.fromDate(monthStart);
    const endTimestamp = admin.firestore.Timestamp.fromDate(monthEnd);

    // Get monthly statistics
    const [
      totalUsers,
      newUsers,
      totalDocuments,
      processedDocuments,
      totalQuestions
    ] = await Promise.all([
      // Total users
      admin.firestore().collection('users').count().get(),
      
      // New users last month
      admin.firestore()
        .collection('users')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .count().get(),
      
      // Total documents last month
      admin.firestore()
        .collection('documents')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .count().get(),
      
      // Processed documents last month
      admin.firestore()
        .collection('documents')
        .where('status', '==', 'processed')
        .where('updatedAt', '>=', startTimestamp)
        .where('updatedAt', '<=', endTimestamp)
        .count().get(),
      
      // Questions asked last month
      admin.firestore()
        .collection('qa_sessions')
        .where('createdAt', '>=', startTimestamp)
        .where('createdAt', '<=', endTimestamp)
        .count().get()
    ]);

    const monthlyReport = {
      period: 'monthly',
      month: lastMonth.getMonth() + 1,
      year: lastMonth.getFullYear(),
      metrics: {
        totalUsers: totalUsers.data().count,
        newUsers: newUsers.data().count,
        totalDocuments: totalDocuments.data().count,
        processedDocuments: processedDocuments.data().count,
        totalQuestions: totalQuestions.data().count,
        processingSuccessRate: totalDocuments.data().count > 0 
          ? Math.round((processedDocuments.data().count / totalDocuments.data().count) * 100) 
          : 0
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore()
      .collection('reports')
      .add(monthlyReport);

    console.log('Monthly report generated:', monthlyReport.metrics);

  } catch (error) {
    console.error('Error generating monthly report:', error);
  }
}