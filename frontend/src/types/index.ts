// Severity levels
export type SeverityLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

// Log entry interface
export interface Log {
  id: string;
  timestamp: string;
  message: string;
  severity: SeverityLevel;
  source: string;
  created_at: string;
  updated_at: string;
}

// Create log request
export interface CreateLogRequest {
  message: string;
  severity: SeverityLevel;
  source: string;
  timestamp?: string;
}

// Update log request
export interface UpdateLogRequest {
  message?: string;
  severity?: SeverityLevel;
  source?: string;
  timestamp?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Search parameters
export interface LogSearchParams {
  start_date?: string;
  end_date?: string;
  severity?: SeverityLevel;
  source?: string;
  message?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Time series data point
export interface TimeSeriesDataPoint {
  period: string;
  count: number;
}

// Log count analytics response
export interface LogCountAnalytics {
  data: TimeSeriesDataPoint[];
  total_count: number;
  granularity: "hour" | "day";
  start_date?: string;
  end_date?: string;
}

// Severity distribution
export interface SeverityDistribution {
  severity: string;
  count: number;
  percentage: number;
}

// Severity distribution response
export interface SeverityDistributionResponse {
  data: SeverityDistribution[];
  total_count: number;
}

// API error response
export interface ApiError {
  detail: string;
}

// Filter state
export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  severity: SeverityLevel | "";
  source: string;
  message: string;
}
