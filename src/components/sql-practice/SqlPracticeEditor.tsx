"use client";

import { useState, useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { compareSqlResult } from "@/lib/sql-practice";
import { submitAttemptAction, requestSqlFeedbackAction } from "@/app/sql-practice/actions";
import { Button } from "@/components/ui/Button";

type TableSchema = { tableName: string; columns: { name: string; type?: string }[] };

function parseSchema(schemaSql: string): TableSchema[] {
  const tables: TableSchema[] = [];
  const regex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?(\w+)["']?\s*\(([\s\S]*?)\)\s*;?/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(schemaSql)) !== null) {
    const tableName = m[1];
    const body = m[2];
    const columns: { name: string; type?: string }[] = [];
    const parts = body.split(",").map((s) => s.trim());
    for (const part of parts) {
      const constraintStart = /^(CONSTRAINT|PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK)\b/i.test(part);
      if (constraintStart) continue;
      const colMatch = part.match(/^["']?(\w+)["']?\s*(.*)$/);
      if (colMatch) {
        columns.push({
          name: colMatch[1],
          type: colMatch[2].trim() || undefined,
        });
      }
    }
    tables.push({ tableName, columns });
  }
  return tables;
}

type SqlPracticeEditorProps = {
  questionId: string;
  problemStatement: string;
  schemaSql: string;
  seedSql: string;
  expectedResult: Record<string, unknown>[];
};

export function SqlPracticeEditor({
  questionId,
  problemStatement,
  schemaSql,
  seedSql,
  expectedResult,
}: SqlPracticeEditorProps) {
  const [code, setCode] = useState("-- Write your SQL here\nSELECT 1;");
  const [runOutput, setRunOutput] = useState<{
    type: "result" | "error";
    message?: string;
    rows?: Record<string, unknown>[];
  } | null>(null);
  const [submitState, setSubmitState] = useState<{
    passed: boolean;
    message?: string;
    attemptId?: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const schemaTables = useMemo(() => parseSchema(schemaSql), [schemaSql]);

  const runSql = useCallback(async () => {
    setRunOutput(null);
    setSubmitState(null);
    setLoading(true);
    try {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/${file}`,
      });
      const db = new SQL.Database();
      try {
        db.exec(schemaSql);
        db.exec(seedSql);
        const execResult = db.exec(code);
        db.close();
        if (execResult.length === 0) {
          setRunOutput({ type: "result", rows: [] });
          return;
        }
        const { columns, values } = execResult[0];
        const rows: Record<string, unknown>[] = values.map((row) => {
          const obj: Record<string, unknown> = {};
          columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
        setRunOutput({ type: "result", rows });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        setRunOutput({ type: "error", message: err });
      } finally {
        try {
          db.close?.();
        } catch {
          // ignore
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setRunOutput({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }, [schemaSql, seedSql, code]);

  const handleSubmit = useCallback(async () => {
    setSubmitState(null);
    setRunOutput(null);
    setLoading(true);
    try {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/${file}`,
      });
      const db = new SQL.Database();
      let actualRows: Record<string, unknown>[] = [];
      let runError: string | null = null;
      try {
        db.exec(schemaSql);
        db.exec(seedSql);
        const execResult = db.exec(code);
        if (execResult.length > 0) {
          const { columns, values } = execResult[0];
          actualRows = values.map((row) => {
            const obj: Record<string, unknown> = {};
            columns.forEach((col, i) => {
              obj[col] = row[i];
            });
            return obj;
          });
        }
      } catch (e) {
        runError = e instanceof Error ? e.message : String(e);
      } finally {
        try {
          db.close?.();
        } catch {
          // ignore
        }
      }
      if (runError) {
        setSubmitState({ passed: false, message: runError });
        setRunOutput({ type: "error", message: runError });
        const res = await submitAttemptAction(questionId, code, false);
        if (res.ok) setSubmitState((s) => (s ? { ...s, attemptId: res.attemptId } : s));
        setLoading(false);
        return;
      }
      const { passed, message } = compareSqlResult(actualRows, expectedResult);
      const res = await submitAttemptAction(
        questionId,
        code,
        passed,
        actualRows
      );
      if (!res.ok) {
        setSubmitState({ passed, message: res.error });
      } else {
        setSubmitState({
          passed,
          message,
          attemptId: res.attemptId,
        });
      }
      setRunOutput({ type: "result", rows: actualRows });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setSubmitState({ passed: false, message });
    } finally {
      setLoading(false);
    }
  }, [questionId, schemaSql, seedSql, code, expectedResult]);

  const handleRequestFeedback = useCallback(async () => {
    const attemptId = submitState?.attemptId;
    if (!attemptId) return;
    setFeedbackLoading(true);
    setFeedback(null);
    try {
      const res = await requestSqlFeedbackAction(attemptId);
      if (res.ok) setFeedback(res.feedback);
      else setFeedback(`Error: ${res.error}`);
    } finally {
      setFeedbackLoading(false);
    }
  }, [submitState?.attemptId]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
      <div className="space-y-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Problem
          </h2>
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-neutral-600 prose-p:dark:text-neutral-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problemStatement}
            </ReactMarkdown>
          </div>
        </div>

        {schemaTables.length > 0 && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Schema
            </h2>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
              Table names and columns you can use in your query.
            </p>
            <div className="space-y-4">
              {schemaTables.map(({ tableName, columns }) => (
                <div
                  key={tableName}
                  className="rounded-md border border-neutral-100 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-800/80"
                >
                  <div className="border-b border-neutral-200 px-3 py-2 font-mono text-sm font-medium text-neutral-900 dark:border-neutral-700 dark:text-white">
                    {tableName}
                  </div>
                  <ul className="list-none px-3 py-2">
                    {columns.map((col) => (
                      <li
                        key={col.name}
                        className="flex items-baseline gap-2 border-b border-neutral-100 last:border-0 dark:border-neutral-700/80 py-1.5 text-sm"
                      >
                        <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                          {col.name}
                        </span>
                        {col.type && (
                          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {col.type}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="border-b border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
            Your solution
          </h2>
          <div className="min-h-[380px]">
            <CodeMirror
              value={code}
              height="380px"
              extensions={[sql()]}
              onChange={setCode}
              basicSetup={{ lineNumbers: true }}
              className="rounded-b-lg border-0 text-sm [&_.cm-editor]:outline-none [&_.cm-scroller]:min-h-[380px]"
            />
          </div>
          <div className="flex gap-2 border-t border-neutral-200 p-3 dark:border-neutral-700">
            <Button
              type="button"
              variant="secondary"
              onClick={runSql}
              disabled={loading}
            >
              {loading ? "Running…" : "Run"}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </div>
        {runOutput && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Result
            </h2>
            {runOutput.type === "error" ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {runOutput.message}
              </p>
            ) : runOutput.rows && runOutput.rows.length > 0 ? (
              <div className="max-h-[320px] overflow-auto rounded border border-neutral-100 dark:border-neutral-700">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-neutral-50 dark:bg-neutral-800/95">
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      {Object.keys(runOutput.rows[0]).map((k) => (
                        <th
                          key={k}
                          className="px-3 py-2 font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {runOutput.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-neutral-100 dark:border-neutral-800"
                      >
                        {Object.values(row).map((v, j) => (
                          <td
                            key={j}
                            className="px-3 py-2 font-mono text-neutral-600 dark:text-neutral-400"
                          >
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No rows returned.
              </p>
            )}
          </div>
        )}
        {submitState && (
          <div
            className={`rounded-lg border p-4 ${
              submitState.passed
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            }`}
          >
            <p
              className={`font-medium ${
                submitState.passed
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-amber-800 dark:text-amber-200"
              }`}
            >
              {submitState.passed ? "Correct!" : "Incorrect"}
            </p>
            {submitState.message && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {submitState.message}
              </p>
            )}
            {submitState.attemptId && (
              <Button
                type="button"
                variant="ghost"
                className="mt-2"
                onClick={handleRequestFeedback}
                disabled={feedbackLoading}
              >
                {feedbackLoading ? "Loading…" : "Get AI feedback"}
              </Button>
            )}
          </div>
        )}
        {feedback && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              AI feedback
            </h2>
            <p className="whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
