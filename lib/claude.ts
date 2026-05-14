// Claude API ラッパー：宇宙旅行の体験テキストを生成する
import Anthropic from "@anthropic-ai/sdk";

export type GenerateInput = {
  destination: string;
  apodTitle: string;
  apodExplanation: string;
};

export async function generateExperience(input: GenerateInput): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY が設定されていません");
  }

  // APIキーはサーバー側でのみ使用する（クライアントには絶対に渡さない）
  const client = new Anthropic({ apiKey });

  const prompt = [
    "あなたはプロの宇宙旅行ガイドです。",
    "旅行者に向けて、その日の宇宙画像をモチーフにした旅行体験記を日本語で書いてください。",
    "",
    `行き先: ${input.destination}`,
    `本日の宇宙画像のタイトル: ${input.apodTitle}`,
    `画像の解説: ${input.apodExplanation}`,
    "",
    "条件:",
    "- 300〜400文字程度",
    "- 「あなた」に語りかける二人称の文体",
    "- 五感を使った臨場感のある描写",
    "- 前置きや見出しは不要。本文だけを出力する",
  ].join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Claude から空の応答が返されました");
  }

  return text;
}
