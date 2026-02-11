import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Analytics and insights from your application logs",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analytics and insights from your application logs
        </p>
      </div>

      {/* Dashboard content - Client Component for interactivity */}
      <DashboardContent />
    </div>
  );
}
