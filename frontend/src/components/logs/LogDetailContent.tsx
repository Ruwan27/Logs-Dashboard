"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogForm from "@/components/LogForm";
import SeverityBadge from "@/components/SeverityBadge";
import Alert from "@/components/Alert";
import ConfirmModal from "@/components/ConfirmModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { logApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Log, UpdateLogRequest } from "@/types";

interface LogDetailContentProps {
  logId: string;
}

export default function LogDetailContent({ logId }: LogDetailContentProps) {
  const router = useRouter();

  // State
  const [log, setLog] = useState<Log | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch log data
  useEffect(() => {
    const fetchLog = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await logApi.getById(logId);
        setLog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch log");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [logId]);

  // Handle update
  const handleUpdate = async (data: UpdateLogRequest) => {
    setIsSaving(true);
    try {
      const updated = await logApi.update(logId, data);
      setLog(updated);
      setIsEditing(false);
      setSuccessMessage("Log updated successfully");
    } catch (err) {
      throw err; // Let the form handle the error
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await logApi.delete(logId);
      router.push("/logs?deleted=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete log");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error && !log) {
    return (
      <>
        <Alert type="error" message={error} />
        <div className="mt-4 text-center">
          <Link href="/logs" className="btn btn-primary">
            Back to Logs
          </Link>
        </div>
      </>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Log not found</h2>
        <p className="mt-2 text-gray-500">
          The requested log entry does not exist.
        </p>
        <Link href="/logs" className="btn btn-primary mt-4">
          Back to Logs
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/logs" className="text-gray-500 hover:text-gray-700">
              Logs
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate max-w-xs">
            {log.id.slice(0, 8)}...
          </li>
        </ol>
      </nav>

      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}
      {successMessage && (
        <div className="mb-6">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        </div>
      )}

      {/* Edit mode */}
      {isEditing ? (
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Edit Log Entry</h1>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
          <div className="card-body">
            <LogForm
              initialData={log}
              onSubmit={handleUpdate}
              isLoading={isSaving}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      ) : (
        <>
          {/* View mode */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">Log Details</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-danger btn-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>

            <div className="card-body space-y-6">
              {/* ID */}
              <div>
                <label className="label">ID</label>
                <p className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {log.id}
                </p>
              </div>

              {/* Severity and Source */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label">Severity</label>
                  <SeverityBadge severity={log.severity} />
                </div>
                <div>
                  <label className="label">Source</label>
                  <p className="text-sm font-medium text-gray-900">
                    {log.source}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <label className="label">Timestamp</label>
                <p className="text-sm text-gray-900">
                  {formatDate(log.timestamp)}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="label">Message</label>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                    {log.message}
                  </pre>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="label">Created At</label>
                  <p className="text-sm text-gray-500">
                    {formatDate(log.created_at)}
                  </p>
                </div>
                <div>
                  <label className="label">Updated At</label>
                  <p className="text-sm text-gray-500">
                    {formatDate(log.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6">
            <Link
              href="/logs"
              className="text-primary-600 hover:text-primary-700"
            >
              ← Back to Logs
            </Link>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Log Entry"
        message="Are you sure you want to delete this log entry? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
