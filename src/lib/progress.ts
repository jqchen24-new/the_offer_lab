import { prisma } from "./db";

export async function getProgressStats() {
  const tasks = await prisma.task.findMany({
    where: { completedAt: { not: null } },
    include: { tags: { include: { tag: true } } },
  });

  let totalMinutes = 0;
  const byTagId = new Map<string, { name: string; slug: string; minutes: number; count: number }>();

  for (const task of tasks) {
    const mins = task.durationMinutes ?? 30;
    totalMinutes += mins;
    for (const tt of task.tags) {
      const t = tt.tag;
      const cur = byTagId.get(t.id) ?? { name: t.name, slug: t.slug, minutes: 0, count: 0 };
      cur.minutes += mins;
      cur.count += 1;
      byTagId.set(t.id, cur);
    }
  }

  const byTag = Array.from(byTagId.values()).sort((a, b) => b.minutes - a.minutes);

  const completedDates = [...new Set(tasks.map((t) => t.completedAt!.toISOString().slice(0, 10)))].sort();
  let streak = 0;
  if (completedDates.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    let d = today;
    while (completedDates.includes(d)) {
      streak++;
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      d = next.toISOString().slice(0, 10);
    }
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekMinutes = tasks
    .filter((t) => t.completedAt && t.completedAt >= weekStart)
    .reduce((sum, t) => sum + (t.durationMinutes ?? 30), 0);

  return {
    totalMinutes,
    weekMinutes,
    byTag,
    streak,
    completedCount: tasks.length,
  };
}
