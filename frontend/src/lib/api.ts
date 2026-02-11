import axios, { AxiosInstance, AxiosError } from "axios";
import {
  Log,
  CreateLogRequest,
  UpdateLogRequest,
  PaginatedResponse,
  LogSearchParams,
  LogCountAnalytics,
  SeverityDistributionResponse,
  SeverityLevel,
} from "@/types";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Error handler
const handleError = (error: AxiosError): never => {
  if (error.response) {
    const message =
      (error.response.data as { detail?: string })?.detail ||
      "An error occurred";
    throw new Error(message);
  } else if (error.request) {
    throw new Error("No response from server. Please check your connection.");
  } else {
    throw new Error(error.message);
  }
};

// Log API functions
export const logApi = {
  
  create: async (data: CreateLogRequest): Promise<Log> => {
    try {
      const response = await api.post<Log>("/logs", data);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  getById: async (id: string): Promise<Log> => {
    try {
      const response = await api.get<Log>(`/logs/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },


  getList: async (
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = "timestamp",
    sortOrder: "asc" | "desc" = "desc",
  ): Promise<PaginatedResponse<Log>> => {
    try {
      const response = await api.get<PaginatedResponse<Log>>("/logs", {
        params: {
          page,
          page_size: pageSize,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  
  search: async (params: LogSearchParams): Promise<PaginatedResponse<Log>> => {
    try {
      const response = await api.get<PaginatedResponse<Log>>("/logs/search", {
        params: {
          ...params,
          page_size: params.page_size || 20,
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  
  update: async (id: string, data: UpdateLogRequest): Promise<Log> => {
    try {
      const response = await api.put<Log>(`/logs/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/logs/${id}`);
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  
  exportCsv: async (params?: {
    start_date?: string;
    end_date?: string;
    severity?: SeverityLevel;
    source?: string;
  }): Promise<Blob> => {
    try {
      const response = await api.get("/logs/export", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};

// Analytics API functions
export const analyticsApi = {
  
  getLogCount: async (params?: {
    granularity?: "hour" | "day";
    start_date?: string;
    end_date?: string;
    severity?: SeverityLevel;
    source?: string;
  }): Promise<LogCountAnalytics> => {
    try {
      const response = await api.get<LogCountAnalytics>(
        "/analytics/log-count",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  
  getSeverityDistribution: async (params?: {
    start_date?: string;
    end_date?: string;
    source?: string;
  }): Promise<SeverityDistributionResponse> => {
    try {
      const response = await api.get<SeverityDistributionResponse>(
        "/analytics/severity-distribution",
        { params },
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{
    status: string;
    api: string;
    database: string;
  }> => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};

export default api;
