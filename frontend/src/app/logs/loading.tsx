import LoadingSpinner from "@/components/LoadingSpinner";
export default function LogsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>

      {/* Filter panel skeleton */}
      <div className="card">
        <div className="card-header">
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table loading */}
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}
