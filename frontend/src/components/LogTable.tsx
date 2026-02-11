"use client";
import React from "react";
import Link from "next/link";
import { Log } from "@/types";
import SeverityBadge from "./SeverityBadge";
import { formatDate, truncateText } from "@/lib/utils";
import clsx from "clsx";

interface LogTableProps {
  logs: Log[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const sortableColumns = [
  { key: "timestamp", label: "Timestamp" },
  { key: "severity", label: "Severity" },
  { key: "source", label: "Source" },
];

export default function LogTable({
  logs,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
  isLoading,
}: LogTableProps) {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-primary-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-primary-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100 border-b"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 border-b flex items-center px-6 space-x-4"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No logs found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or create a new log entry.
          </p>
          <div className="mt-6">
            <Link href="/logs/create" className="btn btn-primary">
              Create Log
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="log-table">
          <thead>
            <tr>
              {sortableColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
              <th>Message</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="text-gray-500">{formatDate(log.timestamp)}</td>
                <td>
                  <SeverityBadge severity={log.severity} />
                </td>
                <td className="font-medium text-gray-900">{log.source}</td>
                <td className="max-w-md">
                  <span className="text-gray-600" title={log.message}>
                    {truncateText(log.message, 80)}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/logs/${log.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(log.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
