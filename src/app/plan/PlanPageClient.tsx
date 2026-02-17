"use client";

import { DailyPlanCard } from "@/components/plan/DailyPlanCard";
import {
  completeTaskAction,
  uncompleteTaskAction,
  deleteTaskAction,
} from "@/app/tasks/actions";
import type { Task } from "@/app/tasks/actions";

export function PlanPageClient({ tasks = [] }: { tasks?: Task[] }) {
  const taskList = Array.isArray(tasks) ? tasks : [];
  if (taskList.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 py-6 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        Nothing scheduled for today. Add from suggestions above or from Tasks.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {taskList.map((task) => (
        <DailyPlanCard
          key={task.id}
          task={task}
          onComplete={completeTaskAction}
          onUncomplete={uncompleteTaskAction}
          onDelete={deleteTaskAction}
        />
      ))}
    </div>
  );
}
