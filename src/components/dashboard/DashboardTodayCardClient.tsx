"use client";

import { useEffect, useState } from "react";
import { getTodayTasksForRange, type TodayTask } from "@/app/dashboard/actions";
import { DashboardTodayCard } from "./DashboardTodayCard";

/** Get start and end of local "today" as ISO strings (UTC) for the server query. */
function getLocalTodayRange(): { startIso: string; endIso: string } {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export function DashboardTodayCardClient({
  serverTodayStartIso,
  serverTodayEndIso,
}: {
  serverTodayStartIso: string;
  serverTodayEndIso: string;
}) {
  const [tasks, setTasks] = useState<TodayTask[] | null>(null);

  useEffect(() => {
    const { startIso, endIso } = getLocalTodayRange();
    Promise.all([
      getTodayTasksForRange(startIso, endIso),
      getTodayTasksForRange(serverTodayStartIso, serverTodayEndIso),
    ]).then(([clientTasks, serverTasks]) => {
      const byId = new Map<string, TodayTask>();
      for (const t of clientTasks) byId.set(t.id, t);
      for (const t of serverTasks) byId.set(t.id, t);
      setTasks(Array.from(byId.values()));
    });
  }, [serverTodayStartIso, serverTodayEndIso]);

  if (tasks === null) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Today
        </h2>
        <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Loading…
        </p>
      </div>
    );
  }

  return <DashboardTodayCard tasks={tasks} />;
}
