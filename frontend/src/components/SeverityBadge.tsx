import React from "react";
import { SeverityLevel } from "@/types";
import { getSeverityColor } from "@/lib/utils";
import clsx from "clsx";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export default function SeverityBadge({
  severity,
  className,
}: SeverityBadgeProps) {
  return (
    <span className={clsx("badge", getSeverityColor(severity), className)}>
      {severity}
    </span>
  );
}
