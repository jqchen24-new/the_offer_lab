import { TaskCard } from "./TaskCard";
import type { Task } from "@/app/tasks/actions";

type TaskWithTags = Task;

export function TaskList({
  tasks,
  onComplete,
  onUncomplete,
  onDelete,
  editPathPrefix = "/tasks",
}: {
  tasks: TaskWithTags[];
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  editPathPrefix?: string;
}) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 py-8 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No tasks yet. Add one above or from Daily Plan.
        </p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onUncomplete={onUncomplete}
            onDelete={onDelete}
            editPathPrefix={editPathPrefix}
          />
        ))
      )}
    </div>
  );
}
