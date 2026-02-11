"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FilterPanel from "@/components/FilterPanel";
import LogTable from "@/components/LogTable";
import Pagination from "@/components/Pagination";
import Alert from "@/components/Alert";
import ConfirmModal from "@/components/ConfirmModal";
import { logApi } from "@/lib/api";
import { formatDateForApi, downloadBlob, pageSizeOptions } from "@/lib/utils";
import { FilterState, Log, PaginatedResponse, SeverityLevel } from "@/types";

export default function LogsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    severity: "",
    source: "",
    message: "",
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    logId: string | null;
  }>({ isOpen: false, logId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Check for success message from URL params
  useEffect(() => {
    if (searchParams.get("deleted") === "true") {
      setSuccessMessage("Log deleted successfully");
      // Clean up URL
      router.replace("/logs", { scroll: false });
    }
  }, [searchParams, router]);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response: PaginatedResponse<Log>;

      if (isFiltered) {
        response = await logApi.search({
          start_date: formatDateForApi(filters.startDate),
          end_date: formatDateForApi(filters.endDate),
          severity: (filters.severity as SeverityLevel) || undefined,
          source: filters.source || undefined,
          message: filters.message || undefined,
          page: pagination.page,
          page_size: pagination.pageSize,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
      } else {
        response = await logApi.getList(
          pagination.page,
          pagination.pageSize,
          sortBy,
          sortOrder,
        );
      }

      setLogs(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.total_pages,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  }, [
    isFiltered,
    filters,
    pagination.page,
    pagination.pageSize,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setIsFiltered(true);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      severity: "",
      source: "",
      message: "",
    });
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle delete
  const handleDeleteClick = (logId: string) => {
    setDeleteModal({ isOpen: true, logId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.logId) return;

    setIsDeleting(true);
    try {
      await logApi.delete(deleteModal.logId);
      setSuccessMessage("Log deleted successfully");
      setDeleteModal({ isOpen: false, logId: null });
      fetchLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete log");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const handleExport = async () => {
    try {
      const blob = await logApi.exportCsv({
        start_date: formatDateForApi(filters.startDate),
        end_date: formatDateForApi(filters.endDate),
        severity: (filters.severity as SeverityLevel) || undefined,
        source: filters.source || undefined,
      });
      downloadBlob(
        blob,
        `logs_export_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      setSuccessMessage("Logs exported successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export logs");
    }
  };

  return (
    <>
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and manage application log entries
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExport} className="btn btn-secondary">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
          <Link href="/logs/create" className="btn btn-primary">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Log
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Results info and page size */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {isFiltered && (
            <span className="mr-2 px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
              Filtered
            </span>
          )}
          Showing {logs.length} of {pagination.total.toLocaleString()} logs
        </p>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-500">Per page:</label>
          <select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            className="select w-20"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log table */}
      <LogTable
        logs={logs}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Log"
        message="Are you sure you want to delete this log entry? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, logId: null })}
        isLoading={isDeleting}
      />
    </>
  );
}
