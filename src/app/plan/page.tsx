import { getTasksForDate, getSuggestedPlanForDate } from "@/lib/tasks";
import { Card, CardTitle } from "@/components/ui/Card";
import { SuggestedPlan } from "@/components/plan/SuggestedPlan";
import { PlanPageClient } from "./PlanPageClient";
import {
  completeTaskAction,
  uncompleteTaskAction,
  deleteTaskAction,
} from "@/app/tasks/actions";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const today = new Date();
  const [todayTasks, suggested] = await Promise.all([
    getTasksForDate(today),
    getSuggestedPlanForDate(today),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Daily Plan
        </h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          Today’s sessions and suggested practice based on your progress.
        </p>
      </div>

      <Card>
        <CardTitle>Suggested for today</CardTitle>
        <SuggestedPlan items={suggested} />
      </Card>

      <Card>
        <CardTitle>Today’s plan</CardTitle>
        <PlanPageClient
          tasks={todayTasks}
          onComplete={completeTaskAction}
          onUncomplete={uncompleteTaskAction}
          onDelete={deleteTaskAction}
        />
      </Card>
    </div>
  );
}
