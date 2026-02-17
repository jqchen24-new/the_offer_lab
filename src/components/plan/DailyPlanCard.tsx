"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Task } from "@/app/tasks/actions";
import Link from "next/link";

type TaskWithTags = Task;

export function DailyPlanCard({
  task,
  onComplete,
  onUncomplete,
  onDelete,
}: {
  task: TaskWithTags;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const completed = !!task.completedAt;
  const scheduled = new Date(task.scheduledAt);
  const timeStr = scheduled.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${
        completed
          ? "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
          : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${completed ? "line-through opacity-70" : ""}`}>
          {task.title}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {timeStr}
          {task.durationMinutes != null && ` · ${task.durationMinutes} min`}
        </p>
        {task.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {task.tags.map((tt) => (
              <Badge key={tt.tag.id}>{tt.tag.name}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {completed ? (
          <Button variant="ghost" onClick={() => onUncomplete(task.id)}>
            Undo
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => onComplete(task.id)}>
            Done
          </Button>
        )}
        <Link href={`/tasks/${task.id}`}>
          <Button variant="ghost">Edit</Button>
        </Link>
        <Button variant="ghost" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
