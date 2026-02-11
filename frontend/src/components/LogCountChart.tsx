"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimeSeriesDataPoint } from "@/types";
import LoadingSpinner from "./LoadingSpinner";

interface LogCountChartProps {
  data: TimeSeriesDataPoint[];
  granularity: "hour" | "day";
  isLoading?: boolean;
}

export default function LogCountChart({
  data,
  granularity,
  isLoading,
}: LogCountChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            No data available for the selected period
          </p>
        </div>
      </div>
    );
  }

  // Format the period for display
  const formatPeriod = (period: string) => {
    if (granularity === "hour") {
      // Extract just the hour part
      const parts = period.split(" ");
      return parts[1] || period;
    }
    // For day, show month-day
    const parts = period.split("-");
    return `${parts[1]}/${parts[2]}`;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
            tickFormatter={formatPeriod}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ color: "#111827", fontWeight: 500 }}
            itemStyle={{ color: "#3b82f6" }}
            formatter={(value: number) => [value, "Log Count"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name="Log Count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#1d4ed8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
