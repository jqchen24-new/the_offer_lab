"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
      <p className="text-center text-neutral-700 dark:text-neutral-300">
        Something went wrong.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
