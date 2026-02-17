"use server";

import { revalidatePath } from "next/cache";
import { createTag, deleteTag } from "@/lib/tags";

export async function createTagAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required" };
  try {
    await createTag(name);
    revalidatePath("/tags");
    revalidatePath("/tasks");
    revalidatePath("/plan");
    return { error: null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to create tag",
    };
  }
}

export async function deleteTagAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  try {
    await deleteTag(id);
    revalidatePath("/tags");
    revalidatePath("/tasks");
    revalidatePath("/plan");
  } catch (e) {
    console.error(e);
  }
}
