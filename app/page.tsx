"use client";

import { useState, useEffect } from "react";
import { questions } from "@/constants/questions";
import { diagnose, type DiagnoseInput } from "@/app/actions/diagnose";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Lightbulb,
  Route,
  Activity,
  Share2,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [answers, setAnswers] = useState<DiagnoseInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filledCount = questions.filter((q) => answers[q.id] != null).length;
  const progressPercentage = (filledCount / questions.length) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const loadingMessages = [
    "回答データを分析中...",
    "現在の課題を抽出中...",
    "AI活用のアドバイスを作成中...",
  ];

  const shareToLine = () => {
    if (!result || typeof window === "undefined") return;

    const scoreMatch = result.match(/(\d{1,3})点/);
    const score = scoreMatch ? scoreMatch[1] : null;
    const currentUrl = window.location.href;

    const text = score
      ? "私のAI導入準備度は" + score + "点でした！ #AI診断"
      : "私のAI導入準備度を診断しました！ #AI診断";

    const shareUrl = "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(currentUrl) + "&text=" + encodeURIComponent(text);

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (filledCount < questions.length) {
      setError((questions.length - filledCount) + " 問が未回答です。すべて選択してください。");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const text = await diagnose(answers);
      setResult(text);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "診断の取得に失敗しました。しばらくしてから再試行してください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAnswers({});
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract score for the gauge
  const scoreMatch = result?.match(/(\d{1,3})点/);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-emerald-500";
    if (s >= 40) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Sticky Progress Bar */}
      {!result && (
        <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
          <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-900">
            <motion.div
              className="h-full bg-zinc-900 dark:bg-zinc-100"
              initial={{ width: 0 }}
              animate={{ width: progressPercentage + "%" }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>
          <div className="mx-auto max-w-3xl px-4 py-3 flex justify-between items-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span>回答進捗</span>
            <span className={filledCount === questions.length ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}>
              {filledCount} / {questions.length}
            </span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {!result && (
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-500">
              業務環境・IT活用 問診
            </h1>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              20問に答えると、AIがあなたの業務環境を分析し、最適なITツールやAI活用の第一歩を提案します。
            </p>
          </div>
        )}

        {result == null ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.fieldset
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-zinc-200 dark:bg-zinc-800 group-focus-within:bg-zinc-900 dark:group-focus-within:bg-zinc-100 transition-colors" />

                  <legend className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    {q.category} • Q{q.id}
                  </legend>
                  <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {q.text}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                    {q.choices.map((choice) => {
                      const isSelected = answers[q.id] === choice.value;

                      let labelClassName = "flex-1 sm:flex-none cursor-pointer flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm sm:text-base font-medium transition-all duration-200 ";
                      if (isSelected) {
                        labelClassName += "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-md transform scale-[1.02]";
                      } else {
                        labelClassName += "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800";
                      }

                      let radioClassName = "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ";
                      if (isSelected) {
                        radioClassName += "border-white dark:border-zinc-900";
                      } else {
                        radioClassName += "border-zinc-400 dark:border-zinc-500";
                      }

                      return (
                        <label key={choice.value} className={labelClassName}>
                          <input
                            type="radio"
                            name={"q-" + q.id}
                            value={choice.value}
                            checked={isSelected}
                            onChange={() => handleChange(q.id, choice.value)}
                            className="sr-only"
                          />
                          <div className={radioClassName}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-900" />}
                          </div>
                          <span>{choice.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </motion.fieldset>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 flex gap-3 text-red-800 dark:text-red-300">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 pb-20">
              <button
                type="submit"
                disabled={isSubmitting || filledCount < questions.length}
                className="group relative flex w-full h-16 items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] hover:shadow-2xl active:scale-95"
              >
                {isSubmitting ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>分析中...</span>
                    </div>
                    <motion.span
                      key={loadingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-normal text-zinc-300 dark:text-zinc-600"
                    >
                      {loadingMessages[loadingStep]}
                    </motion.span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    診断結果を見る
                    <Activity className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}

                {/* Shiny highlight effect */}
                {!isSubmitting && (
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:animate-shimmer" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-4"
          >
            {/* Header Actions */}
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 transition-colors backdrop-blur-sm self-start"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>最初からやり直す</span>
              </button>

              <button
                type="button"
                onClick={shareToLine}
                className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#06C755]/20 transition-all hover:bg-[#05b34c] hover:-translate-y-0.5 self-start sm:self-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>LINEで結果を共有</span>
              </button>
            </div>

            {/* Score Showcase */}
            <motion.div variants={fadeIn} className="mb-12 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-zinc-500 dark:text-zinc-400 mb-6 uppercase tracking-widest">
                あなたのAI導入準備レベル
              </h2>

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
                {/* Background Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-zinc-100 dark:text-zinc-800"
                  />
                  {/* Animated Progress Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={getScoreColor(score)}
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: ((score / 100) * 283) + " 283" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className={"text-6xl sm:text-7xl font-black tracking-tighter " + getScoreColor(score)}>
                      {score}
                    </span>
                    <span className="text-2xl font-bold text-zinc-400">点</span>
                  </div>
                </div>
              </div>

              <div className="max-w-md">
                <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                  {score >= 80 ? "素晴らしい準備状況です！すぐにでも高度なAI活用が始められます。" :
                    score >= 50 ? "基本的なIT環境は整いつつあります。着実にAIを取り入れていきましょう。" :
                      "まずは基礎的なデジタル化やルール作りから始めることで、劇的な業務改善が見込めます。"}
                </p>
              </div>
            </motion.div>

            {/* Markdown Parsing into rich cards */}
            <motion.div variants={fadeIn} className="space-y-8">
              <div className="w-full flex flex-col gap-8">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      // Skip rendering the score header since we have the visual gauge
                      if (text.includes("準備レベル")) return null;

                      let Icon = CheckCircle2;
                      let bgColor = "bg-zinc-100 dark:bg-zinc-800";
                      let iconColor = "text-zinc-900 dark:text-zinc-100";
                      let borderColor = "border-zinc-200 dark:border-zinc-700";

                      if (text.includes("隠れた損失")) {
                        Icon = AlertTriangle;
                        bgColor = "bg-red-50 dark:bg-red-950/20";
                        iconColor = "text-red-600 dark:text-red-400";
                        borderColor = "border-red-200 dark:border-red-900/50";
                      } else if (text.includes("処方箋")) {
                        Icon = Lightbulb;
                        bgColor = "bg-amber-50 dark:bg-amber-950/20";
                        iconColor = "text-amber-600 dark:text-amber-400";
                        borderColor = "border-amber-200 dark:border-amber-900/50";
                      } else if (text.includes("進め方")) {
                        Icon = Route;
                        bgColor = "bg-blue-50 dark:bg-blue-950/20";
                        iconColor = "text-blue-600 dark:text-blue-400";
                        borderColor = "border-blue-200 dark:border-blue-900/50";
                      }

                      return (
                        <div className={"flex items-center gap-3 mt-8 first:mt-0 " + bgColor + " " + borderColor + " border-t border-x p-4 sm:p-5 rounded-t-2xl relative z-10"}>
                          <div className={"p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm " + iconColor}>
                            <Icon className="w-6 h-6 stroke-[2.5]" />
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            {children}
                          </h2>
                        </div>
                      );
                    },
                    p: ({ children }) => {
                      const text = String(children);
                      if (text.match(/^\d{1,3}点/)) return null;

                      return (
                        <div className="bg-white dark:bg-zinc-900 border-x border-zinc-200 dark:border-zinc-800 px-6 sm:px-8 py-4 shadow-sm relative z-0 [&:last-child]:rounded-b-2xl [&:last-child]:border-b [&:nth-child(2)]:pt-8">
                          <p className="text-zinc-700 dark:text-zinc-300 leading-loose text-[15px] sm:text-base">
                            {children}
                          </p>
                        </div>
                      );
                    },
                    ul: ({ children }) => (
                      <div className="bg-white dark:bg-zinc-900 border-x border-zinc-200 dark:border-zinc-800 px-6 sm:px-8 py-2 shadow-sm relative z-0 [&:last-child]:rounded-b-2xl [&:last-child]:border-b [&:last-child]:pb-8">
                        <ul className="space-y-4">
                          {children}
                        </ul>
                      </div>
                    ),
                    li: ({ children }) => (
                      <li className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 leading-relaxed text-[15px] sm:text-base">
                        <span className="text-zinc-400 dark:text-zinc-600 mt-[0.4rem] flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        </span>
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md mx-0.5 border border-zinc-200 dark:border-zinc-700">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {/* We need to pre-process the result to ensure paragraphs directly following h2s are wrapped properly if needed, but our CSS handles the basic layout nicely. */}
                  {result}
                </ReactMarkdown>
              </div>
            </motion.div>

            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-8 text-base font-bold text-white dark:text-zinc-900 shadow hover:scale-105 transition-transform"
              >
                <RefreshCcw className="w-5 h-5" />
                もう一度診断する
              </button>
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
}
