import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getSqlQuestionBySlug } from "@/lib/sql-practice";
import { Button } from "@/components/ui/Button";
import { SqlPracticeEditor } from "@/components/sql-practice/SqlPracticeEditor";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const question = await getSqlQuestionBySlug(slug);
  if (!question) return { title: "SQL Practice" };
  return { title: question.title };
}

export default async function SqlQuestionPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Sign in to practice SQL.
        </p>
        <Link href="/signin">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }
  const { slug } = await params;
  const question = await getSqlQuestionBySlug(slug);
  if (!question) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/sql-practice"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            ← SQL Practice
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
            {question.title}
          </h1>
          {question.difficulty && (
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400 capitalize">
              {question.difficulty}
            </p>
          )}
        </div>
      </div>
      <SqlPracticeEditor
        questionId={question.id}
        problemStatement={question.problemStatement}
        schemaSql={question.schemaSql}
        seedSql={question.seedSql}
        expectedResult={question.expectedResult as Record<string, unknown>[]}
      />
    </div>
  );
}
