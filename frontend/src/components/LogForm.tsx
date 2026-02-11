"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CreateLogRequest,
  UpdateLogRequest,
  SeverityLevel,
  Log,
} from "@/types";
import { severityOptions } from "@/lib/utils";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";

interface LogFormProps {
  initialData?: Log;
  onSubmit: (data: CreateLogRequest | UpdateLogRequest) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function LogForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: LogFormProps) {
  const [formData, setFormData] = useState({
    message: initialData?.message || "",
    severity: (initialData?.severity || "INFO") as SeverityLevel,
    source: initialData?.source || "",
    timestamp: initialData?.timestamp ? new Date(initialData.timestamp) : null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length > 10000) {
      newErrors.message = "Message must be less than 10000 characters";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    } else if (formData.source.length > 255) {
      newErrors.source = "Source must be less than 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      await onSubmit({
        message: formData.message.trim(),
        severity: formData.severity,
        source: formData.source.trim(),
        timestamp: formData.timestamp?.toISOString(),
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert
          type="error"
          message={submitError}
          onClose={() => setSubmitError(null)}
        />
      )}

      {/* Source */}
      <div>
        <label htmlFor="source" className="label">
          Source <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="source"
          value={formData.source}
          onChange={(e) => {
            setFormData({ ...formData, source: e.target.value });
            if (errors.source) setErrors({ ...errors, source: "" });
          }}
          placeholder="e.g., api-gateway, auth-service"
          className={`input ${errors.source ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
        {errors.source && (
          <p className="mt-1 text-sm text-red-600">{errors.source}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Identifier for the log source (e.g., service name, component)
        </p>
      </div>

      {/* Severity */}
      <div>
        <label htmlFor="severity" className="label">
          Severity <span className="text-red-500">*</span>
        </label>
        <select
          id="severity"
          value={formData.severity}
          onChange={(e) =>
            setFormData({
              ...formData,
              severity: e.target.value as SeverityLevel,
            })
          }
          className="select"
        >
          {severityOptions
            .filter((opt) => opt.value !== "")
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>

      {/* Timestamp */}
      <div>
        <label htmlFor="timestamp" className="label">
          Timestamp
        </label>
        <DatePicker
          selected={formData.timestamp}
          onChange={(date) => setFormData({ ...formData, timestamp: date })}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm:ss"
          placeholderText="Select timestamp (optional, defaults to now)"
          isClearable
          className="input"
        />
        <p className="mt-1 text-sm text-gray-500">
          Leave empty to use current time
        </p>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="label">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: "" });
          }}
          rows={6}
          placeholder="Enter log message..."
          className={`input ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.message.length} / 10000 characters
        </p>
      </div>

      {/* Submit button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Saving...</span>
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
