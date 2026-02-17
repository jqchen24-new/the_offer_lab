"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function PlanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Plan page error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 px-4">
      <p className="text-center font-medium text-neutral-800 dark:text-neutral-200">
        Daily Plan failed to load
      </p>
      <pre className="max-h-48 max-w-full overflow-auto rounded border border-red-200 bg-red-50 p-3 text-left text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
        {error.message}
      </pre>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
