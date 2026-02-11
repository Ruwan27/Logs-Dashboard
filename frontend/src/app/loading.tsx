import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>

      {/* Filter panel skeleton */}
      <div className="card">
        <div className="card-header">
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse w-12 h-12"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart loading */}
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}
