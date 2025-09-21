// API Request and Response Types
import type {
  User,
  Document,
  DocumentAnalysis,
  Team,
  TeamRole,
  TeamPermission,
  TeamSettings,
  TeamMember,
  Subscription,
  UserProfile,
  UserPreferences,
  UsageStats,
  SearchFilters,
  SortOptions,
  Answer,
  Question,
  Translation,
  Comment,
  Notification,
  NotificationType,
  Template,
  TemplateField,
  AnalyticsDashboard,
  SystemHealth
} from './index';

// Generic API Types
export interface ApiRequest<T = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers?: Record<string, string>;
  body?: T;
  query?: Record<string, any>;
  params?: Record<string, string>;
}

export interface ApiResponseMeta {
  requestId: string;
  version: string;
  timestamp: Date;
  processingTime: number;
  rateLimit?: RateLimitInfo;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  emailVerificationSent: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
  resetTokenSent: boolean;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

// Document API Types
export interface UploadDocumentRequest {
  file: File;
  name?: string;
  tags?: string[];
  category?: string;
  teamId?: string;
}

export interface UploadDocumentResponse {
  document: Document;
  uploadUrl: string;
}

export interface ProcessDocumentRequest {
  documentId: string;
  analysisType: 'quick' | 'full' | 'custom';
  options?: ProcessingOptions;
}

export interface ProcessingOptions {
  extractEntities?: boolean;
  riskAssessment?: boolean;
  simplifyText?: boolean;
  translateTo?: string;
  detectLanguage?: boolean;
  ocrEnabled?: boolean;
}

export interface ProcessDocumentResponse {
  jobId: string;
  estimatedTime: number;
  status: 'queued' | 'processing';
}

export interface GetDocumentsRequest {
  page?: number;
  limit?: number;
  search?: string;
  filters?: SearchFilters;
  sort?: SortOptions;
}

export interface GetDocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GetDocumentRequest {
  documentId: string;
  includeAnalysis?: boolean;
  includeComments?: boolean;
}

export interface GetDocumentResponse {
  document: Document;
  analysis?: DocumentAnalysis;
  comments?: Comment[];
}

export interface UpdateDocumentRequest {
  documentId: string;
  updates: Partial<Document>;
}

export interface DeleteDocumentRequest {
  documentId: string;
  permanent?: boolean;
}

// Analysis API Types
export interface AnalyzeDocumentRequest {
  documentId: string;
  type: 'full' | 'quick' | 'risk_only' | 'entities_only';
  language?: string;
  customPrompt?: string;
}

export interface AnalyzeDocumentResponse {
  analysis: DocumentAnalysis;
  processingTime: number;
  tokensUsed: number;
}

export interface GetAnalysisRequest {
  analysisId: string;
  format?: 'json' | 'pdf' | 'docx';
}

export interface GetAnalysisResponse {
  analysis: DocumentAnalysis;
  downloadUrl?: string;
}

export interface CompareDocumentsRequest {
  documentIds: string[];
  comparisonType: 'clauses' | 'risks' | 'terms' | 'full';
}

export interface CompareDocumentsResponse {
  comparison: DocumentComparison;
  similarities: ComparisonResult[];
  differences: ComparisonResult[];
}

export interface DocumentComparison {
  id: string;
  documentIds: string[];
  type: string;
  summary: string;
  score: number;
  createdAt: Date;
}

export interface ComparisonResult {
  type: 'similarity' | 'difference';
  section: string;
  content: string;
  score: number;
  documents: string[];
}

// Q&A API Types
export interface AskQuestionRequest {
  documentId: string;
  question: string;
  context?: string;
  language?: string;
}

export interface AskQuestionResponse {
  questionId: string;
  answer: Answer;
  suggestions: string[];
  relatedClauses: string[];
}

export interface GetQuestionsRequest {
  documentId: string;
  page?: number;
  limit?: number;
}

export interface GetQuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  limit: number;
}

// Translation API Types
export interface TranslateDocumentRequest {
  documentId: string;
  targetLanguage: string;
  preserveFormatting?: boolean;
}

export interface TranslateDocumentResponse {
  translationId: string;
  estimatedTime: number;
  cost: number;
}

export interface GetTranslationRequest {
  translationId: string;
  format?: 'json' | 'pdf' | 'docx';
}

export interface GetTranslationResponse {
  translation: Translation;
  downloadUrl?: string;
}

// User API Types
export interface GetUserProfileRequest {
  userId?: string;
}

export interface GetUserProfileResponse {
  user: User;
  subscription: Subscription;
  usage: UsageStats;
}

export interface UpdateUserProfileRequest {
  updates: Partial<UserProfile>;
}

export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
  confirmation: string;
}

// Team API Types
export interface CreateTeamRequest {
  name: string;
  description?: string;
  settings?: Partial<TeamSettings>;
}

export interface CreateTeamResponse {
  team: Team;
  inviteCode: string;
}

export interface InviteTeamMemberRequest {
  teamId: string;
  email: string;
  role: TeamRole;
  permissions?: TeamPermission[];
  message?: string;
}

export interface InviteTeamMemberResponse {
  invitation: TeamInvitation;
  inviteUrl: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface JoinTeamRequest {
  inviteCode: string;
}

export interface JoinTeamResponse {
  team: Team;
  member: TeamMember;
}

export interface UpdateTeamMemberRequest {
  teamId: string;
  userId: string;
  updates: Partial<TeamMember>;
}

export interface RemoveTeamMemberRequest {
  teamId: string;
  userId: string;
}

// Subscription API Types
export interface CreateSubscriptionRequest {
  priceId: string;
  paymentMethodId: string;
  trialDays?: number;
}

export interface CreateSubscriptionResponse {
  subscription: Subscription;
  clientSecret?: string;
  requiresAction: boolean;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  priceId?: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
  cancelAtPeriodEnd?: boolean;
  cancellationReason?: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  subscriptionId?: string;
  description?: string;
}

export interface CreatePaymentIntentResponse {
  paymentIntent: PaymentIntent;
  clientSecret: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// Template API Types
export interface GetTemplatesRequest {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'popularity' | 'rating' | 'recent';
}

export interface GetTemplatesResponse {
  templates: Template[];
  total: number;
  page: number;
  limit: number;
  categories: string[];
}

export interface CreateTemplateRequest {
  name: string;
  description: string;
  category: string;
  content: string;
  fields: TemplateField[];
  isPublic?: boolean;
  tags?: string[];
}

export interface CreateTemplateResponse {
  template: Template;
}

export interface GenerateDocumentRequest {
  templateId: string;
  data: Record<string, any>;
  format: 'pdf' | 'docx' | 'html';
}

export interface GenerateDocumentResponse {
  documentId: string;
  downloadUrl: string;
  previewUrl: string;
}

// Notification API Types
export interface GetNotificationsRequest {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType[];
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface MarkNotificationReadRequest {
  notificationIds: string[];
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
}

// Analytics API Types
export interface GetAnalyticsRequest {
  startDate: Date;
  endDate: Date;
  metrics?: AnalyticsMetric[];
  groupBy?: 'day' | 'week' | 'month';
}

export type AnalyticsMetric = 
  | 'documents_processed'
  | 'risks_identified'
  | 'questions_asked'
  | 'users_active'
  | 'revenue'
  | 'conversion_rate';

export interface GetAnalyticsResponse {
  dashboard: AnalyticsDashboard;
  charts: AnalyticsChart[];
  insights: AnalyticsInsight[];
}

export interface AnalyticsChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartDataPoint[];
  config: ChartConfig;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface ChartConfig {
  xAxis: string;
  yAxis: string;
  color: string;
  showLegend: boolean;
  showTooltip: boolean;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'improvement' | 'warning' | 'info';
  metric: string;
  change: number;
  period: string;
}

// Search API Types
export interface SearchRequest {
  query: string;
  type?: 'documents' | 'clauses' | 'risks' | 'all';
  filters?: SearchFilters;
  facets?: string[];
  highlight?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  facets: SearchFacet[];
  suggestions: string[];
  queryTime: number;
}

export interface SearchResult {
  id: string;
  type: 'document' | 'clause' | 'risk';
  title: string;
  excerpt: string;
  highlights: string[];
  score: number;
  metadata: Record<string, any>;
  url: string;
}

export interface SearchFacet {
  name: string;
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
  selected: boolean;
}

// Admin API Types
export interface GetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: 'name' | 'email' | 'created' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  stats: UserStats;
}

export interface UserStats {
  total: number;
  active: number;
  premium: number;
  newThisMonth: number;
}

export interface UpdateUserRequest {
  userId: string;
  updates: Partial<User>;
}

export interface GetSystemStatsRequest {
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface GetSystemStatsResponse {
  health: SystemHealth;
  performance: PerformanceMetrics;
  usage: SystemUsage;
  errors: ErrorSummary[];
}

export interface PerformanceMetrics {
  avgResponseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

export interface SystemUsage {
  activeUsers: number;
  documentsProcessed: number;
  storageUsed: number;
  apiCalls: number;
  costs: CostBreakdown;
}

export interface CostBreakdown {
  total: number;
  ai: number;
  storage: number;
  bandwidth: number;
  compute: number;
}

export interface ErrorSummary {
  type: string;
  count: number;
  lastOccurred: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Export types for use in other packages
export type { User } from './index';
export type { Document } from './index';
export type { DocumentAnalysis } from './index';
export type { Team } from './index';
export type { Subscription } from './index';