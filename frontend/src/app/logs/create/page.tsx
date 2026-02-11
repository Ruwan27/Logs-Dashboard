import type { Metadata } from "next";
import { CreateLogContent } from "@/components/logs";

export const metadata: Metadata = {
  title: "Create Log",
  description: "Add a new log entry to the system",
};

export default function CreateLogPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Log Entry</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new log entry to the system
        </p>
      </div>

      {/* Create form - Client Component */}
      <CreateLogContent />
    </div>
  );
}
