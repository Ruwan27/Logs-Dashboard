import LoadingSpinner from "@/components/LoadingSpinner";

export default function LogDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb skeleton */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </nav>

      {/* Card skeleton */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
