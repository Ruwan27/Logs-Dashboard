"use client";
import { useEffect } from "react";
import Alert from "@/components/Alert";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analytics and insights from your application logs
        </p>
      </div>

      <Alert
        type="error"
        message={error.message || "Something went wrong loading the dashboard"}
      />

      <div className="flex justify-center">
        <button onClick={reset} className="btn btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
