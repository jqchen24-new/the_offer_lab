"use client";

import { useState, useMemo } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { TasksCalendar } from "@/components/tasks/TasksCalendar";
import type { Task } from "@/app/tasks/actions";

type Tag = { id: string; name: string; slug: string };

/** Local calendar date as YYYY-MM-DD (avoids timezone off-by-one). */
function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isScheduledOnDate(task: Task, date: Date): boolean {
  return dateKey(new Date(task.scheduledAt)) === dateKey(date);
}

export function TasksPageClient({
  upcoming,
  past,
  tags,
  onComplete,
  onUncomplete,
  onDelete,
}: {
  upcoming: Task[];
  past: Task[];
  tags: Tag[];
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [tagId, setTagId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const datesWithTasks = useMemo(() => {
    const keys = new Set<string>();
    [...upcoming, ...past].forEach((t) => {
      keys.add(dateKey(new Date(t.scheduledAt)));
    });
    return Array.from(keys);
  }, [upcoming, past]);

  const filteredUpcoming =
    tagId === ""
      ? upcoming
      : upcoming.filter((t) => t.tags.some((tt) => tt.tagId === tagId));
  const filteredPast =
    tagId === ""
      ? past
      : past.filter((t) => t.tags.some((tt) => tt.tagId === tagId));

  const tasks = selectedDate
    ? [...upcoming, ...past]
        .filter((t) => isScheduledOnDate(t, selectedDate))
        .filter((t) =>
          tagId === "" ? true : t.tags.some((tt) => tt.tagId === tagId)
        )
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime()
        )
    : [...filteredUpcoming, ...filteredPast];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <TasksCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          datesWithTasks={datesWithTasks}
        />
      </div>
      {selectedDate && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing tasks scheduled for{" "}
          <strong>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </strong>
        </p>
      )}
      <TaskList
        tasks={tasks}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
        onDelete={onDelete}
        editPathPrefix="/tasks"
      />
    </div>
  );
}
