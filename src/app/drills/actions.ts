"use server";

import { revalidatePath } from "next/cache";

/**
 * Delete a drill by id.
 * Implement with your data layer (e.g. Prisma) when you have a Drill model.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub: id will be used when Drill model exists
export async function deleteDrillAction(id: string) {
  // TODO: e.g. await prisma.drill.delete({ where: { id } });
  revalidatePath("/drills");
}
