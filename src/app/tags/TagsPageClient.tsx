"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { createTagAction, deleteTagAction } from "@/app/tags/actions";

type Tag = { id: string; name: string; slug: string; isSystem: boolean };

export function TagsPageClient({
  tags,
  showList = false,
}: {
  tags: Tag[];
  showList?: boolean;
}) {
  const [state, formAction] = useActionState<{ error: string | null }, FormData>(
    async (_, formData) => createTagAction(formData),
    { error: null }
  );

  return (
    <>
      {!showList && (
        <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {state?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
          )}
          <div className="flex-1">
            <Input label="Tag name" name="name" placeholder="e.g. System Design" required />
          </div>
          <Button type="submit">Add tag</Button>
        </form>
      )}
      {showList && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag.id} className="inline-flex items-center gap-1.5">
              <Badge>
                {tag.name}
                {tag.isSystem && " (system)"}
              </Badge>
              {!tag.isSystem && (
                <form action={deleteTagAction} className="inline">
                  <input type="hidden" name="id" value={tag.id} />
                  <Button type="submit" variant="ghost" className="!py-0 !px-1 text-neutral-500 hover:text-red-600">
                    ×
                  </Button>
                </form>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
