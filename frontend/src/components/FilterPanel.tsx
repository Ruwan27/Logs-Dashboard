"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FilterState, SeverityLevel } from "@/types";
import { severityOptions } from "@/lib/utils";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  showMessageFilter?: boolean;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  onApply,
  onReset,
  showMessageFilter = true,
}: FilterPanelProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="label">Start Date</label>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) =>
                onFilterChange({ ...filters, startDate: date })
              }
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select start date"
              isClearable
              className="input"
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => onFilterChange({ ...filters, endDate: date })}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select end date"
              isClearable
              className="input"
              minDate={filters.startDate || undefined}
            />
          </div>

          {/* Severity */}
          <div>
            <label className="label">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  severity: e.target.value as SeverityLevel | "",
                })
              }
              className="select"
            >
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="label">Source</label>
            <input
              type="text"
              value={filters.source}
              onChange={(e) =>
                onFilterChange({ ...filters, source: e.target.value })
              }
              placeholder="Filter by source..."
              className="input"
            />
          </div>

          {/* Message search */}
          {showMessageFilter && (
            <div className="md:col-span-2 lg:col-span-4">
              <label className="label">Message Search</label>
              <input
                type="text"
                value={filters.message}
                onChange={(e) =>
                  onFilterChange({ ...filters, message: e.target.value })
                }
                placeholder="Search in log messages..."
                className="input"
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onReset} className="btn btn-secondary">
            Reset
          </button>
          <button onClick={onApply} className="btn btn-primary">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
