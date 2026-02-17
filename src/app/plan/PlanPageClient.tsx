"use client";

import { DailyPlanCard } from "@/components/plan/DailyPlanCard";
import type { Task } from "@/app/tasks/actions";

export function PlanPageClient({
  tasks,
  onComplete,
  onUncomplete,
  onDelete,
}: {
  tasks: Task[];
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 py-6 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        Nothing scheduled for today. Add from suggestions above or from Tasks.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <DailyPlanCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
