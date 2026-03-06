"use client";

export default function ProgressError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold text-red-600">Progress Page Error</h1>
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="font-mono text-sm text-red-800">
          {error.message || "Unknown error"}
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-red-600">Digest: {error.digest}</p>
        )}
        <p className="mt-2 text-xs text-red-600">
          {error.stack?.slice(0, 500) || "No stack trace"}
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded bg-neutral-900 px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
