"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { questions } from "@/constants/questions";

export type DiagnoseInput = Record<number, string>;

export async function diagnose(answers: DiagnoseInput): Promise<string> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY が設定されていません。.env.local を確認してください。"
    );
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const answerLines = questions
    .map((q) => {
      const value = answers[q.id];
      const choice = q.choices.find((c) => c.value === value);
      const label = choice?.label ?? value ?? "（未回答）";
      return `Q${q.id} [${q.category}] ${q.text}\n→ ${label}`;
    })
    .join("\n\n");

  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `あなたは企業のDX推進とAI活用をやさしく導く、頼れる相談役です。問診データに基づき、以下の構成でレポート（Markdown）を作成してください。

## 【DX・AI活用の準備レベル】
100点満点での評価。必ず「〇〇点」という形式を含めてください。
※重要：回答に「分からない」が含まれている場合、現状把握ができていないという点でDXの障壁が高いため、その数に応じてスコアを厳しく減点（最低点へ調整）してください。

## 【放置すると怖い『隠れた損失』】
「紙や手書き」「ネット環境」「安全ルール」「日々の作業」の4点から、今のやり方を続けた場合に自動化の遅れや非効率によって損をする「時間」や「お金」、DX推進を阻む壁について分かりやすく指摘してください。
※「分からない」と回答した項目については、現状把握ができていないこと自体のリスク（見えないコストの発生やセキュリティの盲点）を指摘してください。

## 【明日からできる！DXとAIの処方箋】
難しいツール名ではなく、「まずは会議の声を自動で文字にする」「メールの案をAIに作らせる」「紙の回覧をクラウド共有に変える」など、具体的なDXとAIの第一歩を提案してください。
また、「ChatGPTを使って文章の下書きをする」「Google Geminiで資料をまとめる」「Microsoft Copilotで会議の議事録をとる」など、**具体的なAIツールの名前とその使い方の例**もいくつか挙げてください。「詳しくは専門家へご相談ください」といったアドバイスを添えても構いません。

## 【失敗しないための進め方】
まずは現場の小さな困りごとから試し（DXの第一歩）、効果を実感してから徐々にAI活用を広げていくための、無理のない手順を提案してください。
「分からない」と答えた項目が多い場合は、まず社内の現状を正しく把握すること（棚卸し）自体を第一歩として提案してください。

※トーン：カタカナの難解な専門用語は避けること（例：PoC → 現場での試し導入、OCR → 文字の自動読み取り）。経営者や現場責任者の心強い味方として、丁寧で前向きな言葉遣いに徹すること。`,
    prompt: `以下の問診回答を分析し、上記の構成でDX・AI導入ポテンシャル診断レポートをMarkdownで出力してください。\n\n${answerLines}`,
  });

  return text;
}
