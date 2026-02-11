
import { format, parseISO } from "date-fns";
import { SeverityLevel } from "@/types";

export const formatDate = (
  dateString: string,
  formatStr: string = "MMM dd, yyyy HH:mm:ss",
): string => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
};

export const formatDateForApi = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  return date.toISOString();
};


export const getSeverityColor = (severity: SeverityLevel): string => {
  const colors: Record<SeverityLevel, string> = {
    DEBUG: "bg-gray-100 text-gray-800",
    INFO: "bg-blue-100 text-blue-800",
    WARN: "bg-yellow-100 text-yellow-800",
    ERROR: "bg-red-100 text-red-800",
  };
  return colors[severity] || colors.INFO;
};


export const getSeverityChartColor = (severity: string): string => {
  const colors: Record<string, string> = {
    DEBUG: "#6b7280",
    INFO: "#3b82f6",
    WARN: "#f59e0b",
    ERROR: "#ef4444",
  };
  return colors[severity] || "#3b82f6";
};


export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const severityOptions: { value: SeverityLevel | ""; label: string }[] = [
  { value: "", label: "All Severities" },
  { value: "DEBUG", label: "Debug" },
  { value: "INFO", label: "Info" },
  { value: "WARN", label: "Warning" },
  { value: "ERROR", label: "Error" },
];


export const pageSizeOptions = [10, 20, 50, 100];
