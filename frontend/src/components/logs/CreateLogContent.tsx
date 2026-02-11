"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogForm from "@/components/LogForm";
import Alert from "@/components/Alert";
import { logApi } from "@/lib/api";
import { CreateLogRequest, UpdateLogRequest } from "@/types";

export default function CreateLogContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateLogRequest | UpdateLogRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const log = await logApi.create(data as CreateLogRequest);
      
      router.push(`/logs/${log.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create log");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Error message */}
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <LogForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Create Log"
          />
        </div>
      </div>
    </>
  );
}
