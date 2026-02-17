import { Card } from "@/components/ui/Card";

type Stats = {
  totalMinutes: number;
  weekMinutes: number;
  streak: number;
  completedCount: number;
};

export function ProgressStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Total time</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
          {stats.totalMinutes} min
        </p>
      </Card>
      <Card>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">This week</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
          {stats.weekMinutes} min
        </p>
      </Card>
      <Card>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Streak</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
          {stats.streak} days
        </p>
      </Card>
      <Card>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Sessions completed</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
          {stats.completedCount}
        </p>
      </Card>
    </div>
  );
}
