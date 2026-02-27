-- Add userId to Tag (PostgreSQL)
-- Backfill existing tags to the first user, then enforce NOT NULL and FK.

ALTER TABLE "Tag" ADD COLUMN IF NOT EXISTS "userId" TEXT;

UPDATE "Tag" SET "userId" = (SELECT "id" FROM "User" LIMIT 1) WHERE "userId" IS NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM "Tag" WHERE "userId" IS NULL) THEN
    ALTER TABLE "Tag" ALTER COLUMN "userId" SET NOT NULL;
  END IF;
END $$;

DO $$ BEGIN
  ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DROP INDEX IF EXISTS "Tag_slug_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_userId_slug_key" ON "Tag"("userId", "slug");
