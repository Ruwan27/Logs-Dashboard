"use client";
import React from "react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, currentPage + halfShow);

    // Adjust if at the beginning
    if (currentPage <= halfShow) {
      endPage = Math.min(totalPages, showPages);
    }

    // Adjust if at the end
    if (currentPage > totalPages - halfShow) {
      startPage = Math.max(1, totalPages - showPages + 1);
    }

    // Add first page and ellipsis
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <ul className="flex items-center space-x-1">
            {/* Previous button */}
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                Previous
              </button>
            </li>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <li key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={clsx(
                      "px-3 py-2 text-sm font-medium rounded-md",
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}

            {/* Next button */}
            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={clsx(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            "btn btn-secondary",
            currentPage === 1 && "opacity-50 cursor-not-allowed",
          )}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 self-center">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            "btn btn-secondary",
            currentPage === totalPages && "opacity-50 cursor-not-allowed",
          )}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
