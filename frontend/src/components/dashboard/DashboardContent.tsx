"use client";
import { useState, useEffect, useCallback } from "react";
import FilterPanel from "@/components/FilterPanel";
import LogCountChart from "@/components/LogCountChart";
import SeverityChart from "@/components/SeverityChart";
import Alert from "@/components/Alert";
import StatsCards from "./StatsCards";
import SeverityBreakdown from "./SeverityBreakdown";
import { analyticsApi } from "@/lib/api";
import { formatDateForApi } from "@/lib/utils";
import {
  FilterState,
  LogCountAnalytics,
  SeverityDistributionResponse,
} from "@/types";

export default function DashboardContent() {
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    severity: "",
    source: "",
    message: "",
  });

  const [granularity, setGranularity] = useState<"hour" | "day">("day");
  const [logCountData, setLogCountData] = useState<LogCountAnalytics | null>(
    null,
  );
  const [severityData, setSeverityData] =
    useState<SeverityDistributionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        start_date: formatDateForApi(filters.startDate),
        end_date: formatDateForApi(filters.endDate),
        severity: filters.severity || undefined,
        source: filters.source || undefined,
      };

      const [logCount, severity] = await Promise.all([
        analyticsApi.getLogCount({
          ...params,
          granularity,
        }),
        analyticsApi.getSeverityDistribution(params),
      ]);

      setLogCountData(logCount);
      setSeverityData(severity);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, granularity]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleApplyFilters = () => {
    fetchAnalytics();
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      severity: "",
      source: "",
      message: "",
    });
  };

  return (
    <>
      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        showMessageFilter={false}
      />

      {/* Error message */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Stats cards */}
      <StatsCards
        logCountData={logCountData}
        severityData={severityData}
        isLoading={isLoading}
      />

      {/* Log count trend chart */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Log Count Trend</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setGranularity("hour")}
              className={`btn btn-sm ${
                granularity === "hour" ? "btn-primary" : "btn-secondary"
              }`}
            >
              Hourly
            </button>
            <button
              onClick={() => setGranularity("day")}
              className={`btn btn-sm ${
                granularity === "day" ? "btn-primary" : "btn-secondary"
              }`}
            >
              Daily
            </button>
          </div>
        </div>
        <div className="card-body">
          <LogCountChart
            data={logCountData?.data || []}
            granularity={granularity}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Severity distribution chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">
              Severity Distribution
            </h2>
          </div>
          <div className="card-body">
            <SeverityChart
              data={severityData?.data || []}
              isLoading={isLoading}
            />
          </div>
        </div>

        <SeverityBreakdown severityData={severityData} isLoading={isLoading} />
      </div>
    </>
  );
}
