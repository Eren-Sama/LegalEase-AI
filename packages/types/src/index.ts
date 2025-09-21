// User and Authentication Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'premium';
  emailVerified: boolean;
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  address?: Address;
  timezone: string;
  language: SupportedLanguage;
  avatar?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  defaultLanguage: SupportedLanguage;
  autoSave: boolean;
  betaFeatures: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  documentProcessed: boolean;
  riskAlerts: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  shareUsageData: boolean;
  allowMarketing: boolean;
  dataRetention: '1year' | '2years' | '5years' | 'indefinite';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  originalName: string;
  type: DocumentType;
  mimeType: string;
  size: number;
  userId: string;
  status: DocumentStatus;
  uploadProgress: number;
  storageUrl: string;
  thumbnailUrl?: string;
  metadata: DocumentMetadata;
  analysis?: DocumentAnalysis;
  tags: string[];
  categories: DocumentCategory[];
  isPublic: boolean;
  sharedWith: string[];
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  expiresAt?: Date;
}

export type DocumentType = 'pdf' | 'docx' | 'doc' | 'txt' | 'jpg' | 'jpeg' | 'png';

export type DocumentStatus = 
  | 'uploading' 
  | 'uploaded' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'archived';

export interface DocumentMetadata {
  pageCount?: number;
  wordCount?: number;
  language: SupportedLanguage;
  extractedText?: string;
  extractionConfidence?: number;
  ocrApplied: boolean;
  fileHash: string;
  virusScanResult: 'clean' | 'infected' | 'pending';
  contentType: string;
  originalFormat: string;
}

export type DocumentCategory = 
  | 'contract'
  | 'agreement'
  | 'legal_notice'
  | 'terms_of_service'
  | 'privacy_policy'
  | 'employment'
  | 'real_estate'
  | 'insurance'
  | 'financial'
  | 'other';

// Analysis Types
export interface DocumentAnalysis {
  id: string;
  documentId: string;
  type: AnalysisType;
  status: AnalysisStatus;
  results: AnalysisResults;
  riskScore: RiskScore;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  language: SupportedLanguage;
  createdAt: Date;
  updatedAt: Date;
  processingTime: number;
  aiModel: string;
  confidence: number;
}

export type AnalysisType = 
  | 'full_analysis'
  | 'quick_scan'
  | 'risk_assessment'
  | 'clause_extraction'
  | 'comparison'
  | 'translation';

export type AnalysisStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface AnalysisResults {
  documentType: string;
  sections: DocumentSection[];
  clauses: Clause[];
  entities: Entity[];
  risks: Risk[];
  opportunities: Opportunity[];
  hiddenTerms: HiddenTerm[];
  financialTerms: FinancialTerm[];
  dates: ImportantDate[];
  parties: Party[];
  jurisdiction?: string;
  governingLaw?: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  simplifiedContent: string;
  startPosition: number;
  endPosition: number;
  riskLevel: RiskLevel;
  importance: ImportanceLevel;
  tags: string[];
}

export interface Clause {
  id: string;
  type: ClauseType;
  title: string;
  originalText: string;
  simplifiedText: string;
  riskLevel: RiskLevel;
  explanation: string;
  recommendations: string[];
  legalImplications: string[];
  position: TextPosition;
}

export type ClauseType = 
  | 'termination'
  | 'liability'
  | 'indemnification'
  | 'arbitration'
  | 'governing_law'
  | 'payment'
  | 'intellectual_property'
  | 'confidentiality'
  | 'warranty'
  | 'force_majeure'
  | 'assignment'
  | 'modification'
  | 'severability'
  | 'entire_agreement'
  | 'other';

export interface Entity {
  id: string;
  text: string;
  type: EntityType;
  confidence: number;
  position: TextPosition;
  metadata?: Record<string, any>;
}

export type EntityType = 
  | 'person'
  | 'organization'
  | 'location'
  | 'date'
  | 'money'
  | 'percentage'
  | 'law'
  | 'court'
  | 'contract_term';

export interface Risk {
  id: string;
  type: RiskType;
  severity: RiskLevel;
  title: string;
  description: string;
  impact: string;
  mitigation: string[];
  relatedClauses: string[];
  position?: TextPosition;
}

export type RiskType = 
  | 'financial'
  | 'legal'
  | 'operational'
  | 'compliance'
  | 'reputational'
  | 'technical'
  | 'contractual';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskScore {
  overall: number; // 0-100
  financial: number;
  legal: number;
  operational: number;
  compliance: number;
  breakdown: RiskBreakdown;
}

export interface RiskBreakdown {
  greenClauses: number;
  yellowClauses: number;
  redClauses: number;
  totalClauses: number;
  riskFactors: string[];
  recommendations: string[];
}

export interface Opportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  benefit: string;
  actionRequired: string[];
  priority: ImportanceLevel;
}

export interface HiddenTerm {
  id: string;
  type: string;
  title: string;
  description: string;
  implication: string;
  visibility: 'hidden' | 'obscure' | 'complex';
  position: TextPosition;
}

export interface FinancialTerm {
  id: string;
  type: FinancialType;
  amount?: number;
  currency?: string;
  percentage?: number;
  description: string;
  conditions: string[];
  position: TextPosition;
}

export type FinancialType = 
  | 'fee'
  | 'penalty'
  | 'discount'
  | 'payment'
  | 'deposit'
  | 'refund'
  | 'commission'
  | 'tax'
  | 'interest';

export interface ImportantDate {
  id: string;
  type: DateType;
  date: Date;
  description: string;
  reminder?: boolean;
  criticality: ImportanceLevel;
  position: TextPosition;
}

export type DateType = 
  | 'effective_date'
  | 'expiration_date'
  | 'renewal_date'
  | 'termination_date'
  | 'payment_due'
  | 'milestone'
  | 'deadline'
  | 'notice_period';

export interface Party {
  id: string;
  name: string;
  type: PartyType;
  role: string;
  contact?: ContactInfo;
  obligations: string[];
  rights: string[];
}

export type PartyType = 'individual' | 'company' | 'government' | 'organization';

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: Address;
  website?: string;
}

export type ImportanceLevel = 'low' | 'medium' | 'high' | 'critical';

export interface TextPosition {
  start: number;
  end: number;
  page?: number;
  line?: number;
  column?: number;
}

// Q&A Types
export interface Question {
  id: string;
  documentId: string;
  userId: string;
  text: string;
  context?: string;
  type: QuestionType;
  status: QuestionStatus;
  answer?: Answer;
  relatedClauses: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionType = 
  | 'general'
  | 'specific_clause'
  | 'risk_assessment'
  | 'comparison'
  | 'what_if'
  | 'explanation';

export type QuestionStatus = 'pending' | 'processing' | 'answered' | 'failed';

export interface Answer {
  id: string;
  text: string;
  confidence: number;
  sources: AnswerSource[];
  relatedDocuments: string[];
  suggestions: string[];
  aiModel: string;
  createdAt: Date;
}

export interface AnswerSource {
  type: 'clause' | 'section' | 'document' | 'legal_reference';
  id: string;
  text: string;
  position?: TextPosition;
  confidence: number;
}

// Language and Translation Types
export type SupportedLanguage = 
  | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ru' | 'ar' | 'zh' | 'ja'
  | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or';

export interface Translation {
  id: string;
  documentId: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  status: TranslationStatus;
  translatedContent: string;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TranslationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Subscription and Billing Types
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  priceId: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: SubscriptionFeatures;
  usage: UsageStats;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export interface SubscriptionFeatures {
  documentsPerMonth: number;
  maxFileSize: number; // in MB
  teamMembers: number;
  aiQuestions: number;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  customIntegrations: boolean;
}

export interface UsageStats {
  documentsProcessed: number;
  aiQuestionsAsked: number;
  storageUsed: number; // in bytes
  apiCalls: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  receiptUrl?: string;
  createdAt: Date;
  paidAt?: Date;
}

export type PaymentStatus = 
  | 'succeeded'
  | 'pending'
  | 'failed'
  | 'canceled'
  | 'requires_action';

// Collaboration Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  settings: TeamSettings;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: TeamRole;
  permissions: TeamPermission[];
  joinedAt: Date;
  invitedBy: string;
  status: MemberStatus;
}

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type TeamPermission = 
  | 'view_documents'
  | 'upload_documents'
  | 'edit_documents'
  | 'delete_documents'
  | 'share_documents'
  | 'manage_team'
  | 'view_analytics'
  | 'manage_billing';

export type MemberStatus = 'active' | 'invited' | 'suspended';

export interface TeamSettings {
  allowGuestAccess: boolean;
  defaultPermissions: TeamPermission[];
  requireApprovalForJoining: boolean;
  maxMembers: number;
  dataRetentionDays: number;
}

export interface Comment {
  id: string;
  documentId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  position?: TextPosition;
  parentId?: string; // for replies
  mentions: string[];
  attachments: CommentAttachment[];
  reactions: Reaction[];
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  editedAt?: Date;
  createdAt: Date;
}

export interface CommentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: NotificationPriority;
  expiresAt?: Date;
  createdAt: Date;
  readAt?: Date;
}

export type NotificationType = 
  | 'document_processed'
  | 'risk_alert'
  | 'comment_added'
  | 'team_invitation'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_expired'
  | 'weekly_digest'
  | 'system_update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  type: TemplateType;
  content: string;
  fields: TemplateField[];
  tags: string[];
  author: string;
  isPublic: boolean;
  downloadCount: number;
  rating: number;
  reviews: TemplateReview[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 'contract' | 'agreement' | 'policy' | 'notice' | 'other';

export interface TemplateField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: string[];
}

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'number'
  | 'email'
  | 'phone'
  | 'url'
  | 'boolean';

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface TemplateReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  filters: SearchFilters;
  sort: SortOptions;
  pagination: PaginationOptions;
}

export interface SearchFilters {
  documentType?: DocumentType[];
  category?: DocumentCategory[];
  riskLevel?: RiskLevel[];
  dateRange?: DateRange;
  tags?: string[];
  status?: DocumentStatus[];
  language?: SupportedLanguage[];
  userId?: string;
  teamId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  event: EventType;
  properties: Record<string, any>;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

export type EventType = 
  | 'document_uploaded'
  | 'document_analyzed'
  | 'question_asked'
  | 'risk_identified'
  | 'template_used'
  | 'subscription_upgraded'
  | 'team_created'
  | 'user_registered'
  | 'login'
  | 'logout';

export interface AnalyticsDashboard {
  documentsProcessed: number;
  risksIdentified: number;
  questionsAnswered: number;
  activeUsers: number;
  revenue: number;
  growthRate: number;
  topRisks: string[];
  topCategories: DocumentCategory[];
  userEngagement: EngagementMetrics;
  periodStart: Date;
  periodEnd: Date;
}

export interface EngagementMetrics {
  avgSessionDuration: number;
  avgDocumentsPerUser: number;
  avgQuestionsPerDocument: number;
  userRetention: RetentionMetrics;
}

export interface RetentionMetrics {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

// System Types
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: ServiceStatus[];
  timestamp: Date;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  errorRate: number;
  lastCheck: Date;
}

export interface RateLimit {
  userId: string;
  endpoint: string;
  requests: number;
  windowStart: Date;
  windowEnd: Date;
  limit: number;
  remaining: number;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  data: Record<string, any>;
  timestamp: Date;
  signature: string;
}

export type WebhookEventType = 
  | 'document.processed'
  | 'user.created'
  | 'subscription.updated'
  | 'payment.succeeded'
  | 'risk.detected';

// Export all types
// TODO: Fix export conflicts
// export * from './api';
// export * from './ui';