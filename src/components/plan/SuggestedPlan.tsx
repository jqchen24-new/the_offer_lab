import { addSuggestedToTodayAction } from "@/app/plan/actions";
import type { SuggestedItem } from "@/lib/tasks";
import { Button } from "@/components/ui/Button";

export function SuggestedPlan({ items }: { items: SuggestedItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        No suggestions right now. Add tags and complete some sessions to get suggestions.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Based on your recent activity, consider adding:
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.tagId}>
            <form
              action={async (fd: FormData) => {
                await addSuggestedToTodayAction(fd);
              }}
              className="inline-flex items-center gap-2"
            >
              <input type="hidden" name="tagId" value={item.tagId} />
              <input type="hidden" name="tagName" value={item.tagName} />
              <input type="hidden" name="suggestedMinutes" value={item.suggestedMinutes} />
              <span className="text-neutral-700 dark:text-neutral-300">
                {item.suggestedMinutes} min <strong>{item.tagName}</strong>
              </span>
              <Button type="submit" variant="secondary" className="!py-1 !px-2 text-xs">
                Add to today
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
