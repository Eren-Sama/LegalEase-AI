// UI Component and State Types

import type { ReactNode, ComponentProps, HTMLAttributes } from 'react';
import type { 
  Document, 
  DocumentAnalysis, 
  User, 
  Team, 
  Notification,
  RiskLevel,
  DocumentStatus,
  SupportedLanguage,
  Risk,
  Clause
} from './index';

// Base UI Types
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
}

export interface ErrorState {
  error: Error | null;
  errorMessage?: string;
  hasError: boolean;
  retryAction?: () => void;
}

export interface AsyncState<T = any> extends LoadingState, ErrorState {
  data: T | null;
  lastUpdated?: Date;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  validation?: FormValidation;
  disabled?: boolean;
  helper?: string;
  value?: any;
  onChange?: (value: any) => void;
}

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'textarea' 
  | 'select' 
  | 'multiselect'
  | 'checkbox' 
  | 'radio' 
  | 'file' 
  | 'date' 
  | 'number' 
  | 'phone' 
  | 'url'
  | 'color' 
  | 'range';

export interface FormValidation {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
  required?: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Button Types
export interface ButtonProps extends BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success'
  | 'warning' 
  | 'info';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Input Types
export interface InputProps extends BaseProps {
  type?: FormFieldType;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helper?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: InputSize;
  variant?: InputVariant;
  onChange?: (value: string | number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outline';

// Modal Types
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  centered?: boolean;
}

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Table Types
export interface TableProps<T = any> extends BaseProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  pagination?: TablePagination;
  sorting?: TableSorting;
  selection?: TableSelection<T>;
  filters?: TableFilters;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  onChange: (page: number, pageSize: number) => void;
}

export interface TableSorting {
  field?: string;
  direction?: 'asc' | 'desc';
  onChange: (field: string, direction: 'asc' | 'desc') => void;
}

export interface TableSelection<T = any> {
  selectedRows: T[];
  onChange: (selectedRows: T[]) => void;
  type?: 'checkbox' | 'radio';
}

export interface TableFilters {
  [key: string]: any;
  onChange: (filters: Record<string, any>) => void;
}

// Navigation Types
export interface NavItem {
  key: string;
  title: string;
  path: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: ReactNode;
}

export interface TabItem {
  key: string;
  title: string;
  content?: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  closable?: boolean;
}

// Layout Types
export interface LayoutProps extends BaseProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface SidebarProps extends BaseProps {
  collapsed: boolean;
  onToggle: () => void;
  navigation: NavItem[];
  user?: User;
  onUserMenuClick?: (action: string) => void;
}

export interface HeaderProps extends BaseProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
}

// Card Types
export interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
  cover?: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  size?: CardSize;
}

export type CardSize = 'sm' | 'md' | 'lg';

// Alert Types
export interface AlertProps extends BaseProps {
  type: AlertType;
  title?: string;
  message: string;
  closable?: boolean;
  showIcon?: boolean;
  actions?: ReactNode;
  onClose?: () => void;
}

export type AlertType = 'success' | 'info' | 'warning' | 'error';

// Toast Types
export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  closable?: boolean;
  actions?: ToastAction[];
}

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading';
export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

// Document Component Types
export interface DocumentCardProps extends BaseProps {
  document: Document;
  onClick?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onShare?: (document: Document) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface DocumentListProps extends BaseProps {
  documents: Document[];
  loading?: boolean;
  error?: string;
  onDocumentClick?: (document: Document) => void;
  onDocumentDelete?: (document: Document) => void;
  view?: 'grid' | 'list';
  sortBy?: string;
  filterBy?: Record<string, any>;
}

export interface DocumentViewerProps extends BaseProps {
  document: Document;
  analysis?: DocumentAnalysis;
  showSidebar?: boolean;
  showAnalysis?: boolean;
  onAnalysisToggle?: () => void;
  onQuestionSubmit?: (question: string) => void;
}

export interface DocumentUploadProps extends BaseProps {
  onUpload: (files: FileList) => void;
  onProgress?: (progress: number) => void;
  onComplete?: (documents: Document[]) => void;
  onError?: (error: Error) => void;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

// Analysis Component Types
export interface RiskIndicatorProps extends BaseProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showScore?: boolean;
}

export interface RiskSummaryProps extends BaseProps {
  risks: Risk[];
  showDetails?: boolean;
  onRiskClick?: (risk: Risk) => void;
}

export interface ClauseHighlighterProps extends BaseProps {
  text: string;
  clauses: Clause[];
  selectedClause?: string;
  onClauseSelect?: (clause: Clause) => void;
  showTooltips?: boolean;
}

export interface AnalysisReportProps extends BaseProps {
  analysis: DocumentAnalysis;
  format?: 'summary' | 'detailed' | 'executive';
  exportable?: boolean;
  onExport?: (format: 'pdf' | 'docx' | 'json') => void;
}

// User Interface Types
export interface UserAvatarProps extends BaseProps {
  user: User;
  size?: AvatarSize;
  showName?: boolean;
  showStatus?: boolean;
  onClick?: () => void;
}

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface UserMenuProps extends BaseProps {
  user: User;
  onMenuClick: (action: UserMenuAction) => void;
}

export type UserMenuAction = 
  | 'profile' 
  | 'settings' 
  | 'billing' 
  | 'help' 
  | 'logout';

// Team Component Types
export interface TeamMemberListProps extends BaseProps {
  team: Team;
  onInvite?: () => void;
  onRemoveMember?: (userId: string) => void;
  onUpdateRole?: (userId: string, role: string) => void;
}

export interface TeamInviteModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
  loading?: boolean;
}

// Search Component Types
export interface SearchInputProps extends BaseProps {
  value?: string;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearch: (query: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  loading?: boolean;
  debounceMs?: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'document' | 'clause';
  metadata?: Record<string, any>;
}

export interface SearchFiltersProps extends BaseProps {
  filters: SearchFilter[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset?: () => void;
}

export interface SearchFilter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

export interface FilterOption {
  label: string;
  value: any;
  count?: number;
}

// Notification Component Types
export interface NotificationListProps extends BaseProps {
  notifications: Notification[];
  onMarkRead?: (ids: string[]) => void;
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  showActions?: boolean;
}

export interface NotificationBellProps extends BaseProps {
  unreadCount: number;
  onClick: () => void;
  maxDisplayCount?: number;
}

// Chart Component Types
export interface ChartProps extends BaseProps {
  data: ChartData[];
  type: ChartType;
  config?: ChartConfig;
  loading?: boolean;
  error?: string;
  height?: number;
  width?: number;
}

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'histogram';

export interface ChartData {
  x: any;
  y: any;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartConfig {
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  colors?: string[];
  theme?: 'light' | 'dark';
}

export interface AxisConfig {
  label?: string;
  format?: string;
  min?: number;
  max?: number;
  tickInterval?: number;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface TooltipConfig {
  show: boolean;
  format?: string;
  custom?: (data: ChartData) => string;
}

// Status Component Types
export interface StatusBadgeProps extends BaseProps {
  status: DocumentStatus | 'online' | 'offline' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  pulse?: boolean;
}

export interface ProgressBarProps extends BaseProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  animated?: boolean;
}

// Language Component Types
export interface LanguageSelectorProps extends BaseProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  languages?: SupportedLanguage[];
  showFlags?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Date Component Types
export interface DatePickerProps extends BaseProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  showTime?: boolean;
  size?: InputSize;
}

export interface DateRangePickerProps extends BaseProps {
  value?: [Date, Date];
  onChange: (dates: [Date, Date] | null) => void;
  placeholder?: [string, string];
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  size?: InputSize;
}

// File Component Types
export interface FileDropzoneProps extends BaseProps {
  onDrop: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  loading?: boolean;
  preview?: boolean;
}

export interface FilePreviewProps extends BaseProps {
  file: File | Document;
  onRemove?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

// Accessibility Types
export interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  role?: string;
}

// Theme Types
export interface ThemeConfig {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
  shadows: Shadows;
  borderRadius: BorderRadius;
  zIndex: ZIndex;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  gray: ColorScale;
  background: BackgroundColors;
  text: TextColors;
  border: string;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  surface: string;
  overlay: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
  inverse: string;
}

export interface Typography {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
}

export interface FontFamily {
  sans: string;
  serif: string;
  mono: string;
}

export interface FontSize {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface FontWeight {
  thin: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
}

export interface LineHeight {
  tight: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export interface LetterSpacing {
  tight: string;
  normal: string;
  wide: string;
}

export interface Spacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  6: string;
  8: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
}

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  none: string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ZIndex {
  dropdown: number;
  sticky: number;
  fixed: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}