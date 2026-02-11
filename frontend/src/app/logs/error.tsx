"use client";

import { useEffect } from "react";
import Link from "next/link";
import Alert from "@/components/Alert";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LogsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Logs error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and manage application log entries
          </p>
        </div>
      </div>

      <Alert
        type="error"
        message={error.message || "Something went wrong loading the logs"}
      />

      <div className="flex justify-center space-x-4">
        <button onClick={reset} className="btn btn-primary">
          Try Again
        </button>
        <Link href="/" className="btn btn-secondary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
