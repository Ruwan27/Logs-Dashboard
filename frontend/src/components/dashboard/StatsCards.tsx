import { LogCountAnalytics, SeverityDistributionResponse } from "@/types";

interface StatsCardsProps {
  logCountData: LogCountAnalytics | null;
  severityData: SeverityDistributionResponse | null;
  isLoading: boolean;
}

export default function StatsCards({
  logCountData,
  severityData,
  isLoading,
}: StatsCardsProps) {
  const errorCount =
    severityData?.data.find((d) => d.severity === "ERROR")?.count || 0;
  const warnCount =
    severityData?.data.find((d) => d.severity === "WARN")?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Logs */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Logs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading
                  ? "..."
                  : logCountData?.total_count.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Logs */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Error Logs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? "..." : errorCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Logs */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Warning Logs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? "..." : warnCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
