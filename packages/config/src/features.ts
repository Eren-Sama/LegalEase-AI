// Feature flags and configuration
export const FEATURE_FLAGS = {
  ENABLE_BETA_FEATURES: false,
  ENABLE_TEAM_COLLABORATION: true,
  ENABLE_ADVANCED_ANALYTICS: true,
  ENABLE_DOCUMENT_COMPARISON: true,
  ENABLE_TEMPLATE_LIBRARY: true,
  ENABLE_MULTI_LANGUAGE: true,
  ENABLE_REAL_TIME_COLLABORATION: false,
  ENABLE_API_ACCESS: true,
  ENABLE_WEBHOOK_INTEGRATION: false,
  ENABLE_WHITE_LABEL: false
};

// Feature limits by subscription tier
export const FEATURE_LIMITS = {
  FREE: {
    documentsPerMonth: 5,
    aiQuestionsPerMonth: 20,
    teamMembers: 1,
    apiCallsPerMonth: 0,
    storageGB: 1,
    advancedAnalytics: false,
    prioritySupport: false
  },
  PRO: {
    documentsPerMonth: 100,
    aiQuestionsPerMonth: 500,
    teamMembers: 5,
    apiCallsPerMonth: 1000,
    storageGB: 10,
    advancedAnalytics: true,
    prioritySupport: true
  },
  ENTERPRISE: {
    documentsPerMonth: -1, // unlimited
    aiQuestionsPerMonth: -1, // unlimited
    teamMembers: -1, // unlimited
    apiCallsPerMonth: 10000,
    storageGB: 100,
    advancedAnalytics: true,
    prioritySupport: true
  }
};

// Beta features
export const BETA_FEATURES = {
  DOCUMENT_TEMPLATES_V2: false,
  AI_POWERED_SUGGESTIONS: true,
  VOICE_INTERFACE: false,
  BLOCKCHAIN_VERIFICATION: false
};