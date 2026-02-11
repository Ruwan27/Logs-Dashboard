import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/logs" className="btn btn-secondary">
            View Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
