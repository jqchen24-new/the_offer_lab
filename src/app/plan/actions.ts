"use server";

import { revalidatePath } from "next/cache";
import { createTask } from "@/lib/tasks";

export async function addSuggestedToTodayAction(formData: FormData): Promise<void> {
  const tagId = formData.get("tagId") as string;
  const tagName = formData.get("tagName") as string;
  const suggestedMinutes = parseInt(formData.get("suggestedMinutes") as string, 10) || 30;

  if (!tagId || !tagName) return;

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  await createTask({
    title: `${tagName} practice`,
    durationMinutes: suggestedMinutes,
    scheduledAt: today,
    tagIds: [tagId],
  });
  revalidatePath("/");
  revalidatePath("/plan");
  revalidatePath("/tasks");
  revalidatePath("/progress");
}
