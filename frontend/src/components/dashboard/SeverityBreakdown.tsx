
import { SeverityDistributionResponse } from "@/types";

interface SeverityBreakdownProps {
  severityData: SeverityDistributionResponse | null;
  isLoading: boolean;
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "ERROR":
      return "#ef4444";
    case "WARN":
      return "#f59e0b";
    case "INFO":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
};

export default function SeverityBreakdown({
  severityData,
  isLoading,
}: SeverityBreakdownProps) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">
            Severity Breakdown
          </h2>
        </div>
        <div className="card-body">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-medium text-gray-900">
          Severity Breakdown
        </h2>
      </div>
      <div className="card-body">
        {severityData && severityData.data.length > 0 ? (
          <div className="space-y-4">
            {severityData.data.map((item) => (
              <div key={item.severity} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {item.severity}
                    </span>
                    <span className="text-gray-500">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getSeverityColor(item.severity),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </div>
    </div>
  );
}
