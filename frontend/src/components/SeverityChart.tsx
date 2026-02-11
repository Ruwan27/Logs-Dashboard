"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { SeverityDistribution } from "@/types";
import { getSeverityChartColor } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

interface SeverityChartProps {
  data: SeverityDistribution[];
  isLoading?: boolean;
}

export default function SeverityChart({ data, isLoading }: SeverityChartProps) {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.severity,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            labelLine={{ stroke: "#6b7280", strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getSeverityChartColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [value, `${name} Logs`]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
