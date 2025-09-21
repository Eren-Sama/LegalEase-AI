// Firebase configuration
export const FIREBASE_CONFIG = {
  collections: {
    USERS: 'users',
    DOCUMENTS: 'documents',
    ANALYSIS: 'analysis',
    TEAMS: 'teams',
    NOTIFICATIONS: 'notifications',
    SUBSCRIPTIONS: 'subscriptions',
    TEMPLATES: 'templates'
  },
  storage: {
    buckets: {
      DOCUMENTS: 'documents',
      PROFILES: 'profiles',
      TEMPLATES: 'templates',
      PROCESSED: 'processed'
    }
  },
  functions: {
    regions: {
      PRIMARY: 'us-central1',
      SECONDARY: 'us-east1'
    }
  }
};

// Firestore settings
export const FIRESTORE_SETTINGS = {
  ignoreUndefinedProperties: true,
  merge: true
};

// Storage settings
export const STORAGE_SETTINGS = {
  maxUploadRetry: 3,
  uploadChunkSize: 1024 * 1024 // 1MB chunks
};