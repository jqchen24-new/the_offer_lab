"use client";

import { useState } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import type { Task } from "@/app/tasks/actions";

type Tag = { id: string; name: string; slug: string };

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
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [tagId, setTagId] = useState<string>("");

  const filteredUpcoming =
    tagId === ""
      ? upcoming
      : upcoming.filter((t) => t.tags.some((tt) => tt.tagId === tagId));
  const filteredPast =
    tagId === ""
      ? past
      : past.filter((t) => t.tags.some((tt) => tt.tagId === tagId));
  const tasks = filter === "upcoming" ? filteredUpcoming : filteredPast;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 p-1">
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filter === "upcoming"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilter("past")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filter === "past"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Past
          </button>
        </div>
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
