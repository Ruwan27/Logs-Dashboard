import type { Metadata } from "next";
import LogsContent from "@/components/logs/LogsContent";

export const metadata: Metadata = {
  title: "Logs",
  description: "Browse and manage application log entries",
};

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <LogsContent />
    </div>
  );
}
