"use client";
import { useEffect } from "react";
import Link from "next/link";
import Alert from "@/components/Alert";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LogDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Log detail error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/logs" className="text-gray-500 hover:text-gray-700">
              Logs
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Error</li>
        </ol>
      </nav>

      <Alert
        type="error"
        message={error.message || "Something went wrong loading the log"}
      />

      <div className="flex justify-center space-x-4 mt-6">
        <button onClick={reset} className="btn btn-primary">
          Try Again
        </button>
        <Link href="/logs" className="btn btn-secondary">
          Back to Logs
        </Link>
      </div>
    </div>
  );
}
