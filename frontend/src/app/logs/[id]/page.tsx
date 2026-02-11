import type { Metadata } from "next";
import { LogDetailContent } from "@/components/logs";

interface LogDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Log ${id.slice(0, 8)}...`,
    description: "View and manage log entry details",
  };
}

/**
 * Log Detail Page - Server Component
 * Renders the log detail with view/edit/delete functionality
 */
export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto">
      <LogDetailContent logId={id} />
    </div>
  );
}
