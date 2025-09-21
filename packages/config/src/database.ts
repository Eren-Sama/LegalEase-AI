// Database configuration
export const DATABASE_CONFIG = {
  indexes: [
    {
      collection: 'documents',
      fields: [
        { field: 'userId', order: 'asc' },
        { field: 'createdAt', order: 'desc' }
      ]
    },
    {
      collection: 'documents',
      fields: [
        { field: 'userId', order: 'asc' },
        { field: 'status', order: 'asc' },
        { field: 'updatedAt', order: 'desc' }
      ]
    }
  ],
  caching: {
    ttl: 300000, // 5 minutes
    maxSize: 1000 // 1000 items
  }
};

// Query limits
export const QUERY_LIMITS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  BATCH_SIZE: 500
};