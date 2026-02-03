"use client";

import { useState } from "react";
import { questions } from "@/constants/questions";
import { diagnose, type DiagnoseInput } from "@/app/actions/diagnose";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [answers, setAnswers] = useState<DiagnoseInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filled = questions.filter((q) => answers[q.id] != null).length;
    if (filled < questions.length) {
      setError(`${questions.length - filled} 問が未回答です。すべて選択してください。`);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const text = await diagnose(answers);
      setResult(text);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "診断の取得に失敗しました。しばらくしてから再試行してください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAnswers({});
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          業務環境・IT活用 問診
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          20問に答えると、AIがあなたの業務環境を分析し改善ポイントを提案します。
        </p>

        {result == null ? (
          <form onSubmit={handleSubmit} className="mt-10 space-y-10">
            {questions.map((q) => (
              <fieldset
                key={q.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm"
              >
                <legend className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {q.category}（{q.id}/20）
                </legend>
                <p className="mt-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {q.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {q.choices.map((choice) => (
                    <label
                      key={choice.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm transition-colors has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-100 dark:has-[:checked]:border-zinc-400 dark:has-[:checked]:bg-zinc-700"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={choice.value}
                        checked={answers[q.id] === choice.value}
                        onChange={() => handleChange(q.id, choice.value)}
                        className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                      />
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-950/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium shadow transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    診断中…
                  </span>
                ) : (
                  "診断する"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">診断結果</h2>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                もう一度診断する
              </button>
            </div>
            <article className="prose prose-zinc dark:prose-invert max-w-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="mt-8 mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-6 mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-3 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 list-decimal space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {children}
                    </strong>
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </main>
    </div>
  );
}
