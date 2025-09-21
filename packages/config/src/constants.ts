// Application constants
export const APP_NAME = 'LegalEase AI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Simplify complex legal documents using AI';

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png'];

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Rate limiting
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// API timeouts
export const API_TIMEOUT = 30000; // 30 seconds
export const UPLOAD_TIMEOUT = 300000; // 5 minutes

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: {
    documentsPerMonth: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    aiQuestions: 20,
    teamMembers: 1
  },
  PRO: {
    documentsPerMonth: 100,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    aiQuestions: 500,
    teamMembers: 5
  },
  ENTERPRISE: {
    documentsPerMonth: -1, // unlimited
    maxFileSize: 50 * 1024 * 1024, // 50MB
    aiQuestions: -1, // unlimited
    teamMembers: -1 // unlimited
  }
};

// Document processing
export const PROCESSING_TIMEOUT = 600000; // 10 minutes
export const MAX_DOCUMENT_PAGES = 100;

// UI constants
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;
export const MODAL_ANIMATION_DURATION = 200;