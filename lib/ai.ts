import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiProvider, AiModel, ChatMessage } from "@/types";

export async function streamChatCompletion({
  provider,
  model,
  apiKey,
  documentContent,
  messages,
  onChunk,
  onDone,
  onError,
}: {
  provider: AiProvider;
  model: AiModel;
  apiKey: string;
  documentContent: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}) {
  const systemPrompt = `You are an expert document analyst. A user has uploaded a document and wants to ask questions about it.

DOCUMENT CONTENT:
---
${documentContent.slice(0, 60000)}
---

Answer questions about this document accurately and concisely. If the answer cannot be found in the document, say so clearly.`;

  try {
    if (provider === "openai") {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const stream = await openai.chat.completions.create({
        model,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        ],
        max_tokens: 2048,
      });
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) onChunk(delta);
      }
      onDone();
    } else {
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model });
      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));
      const lastMessage = messages[messages.length - 1];
      const chat = geminiModel.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I will answer questions about this document accurately." }] },
          ...history,
        ],
      });
      const result = await chat.sendMessageStream(lastMessage.content);
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) onChunk(text);
      }
      onDone();
    }
  } catch (err) {
    onError(err instanceof Error ? err : new Error("AI request failed"));
  }
}

export const OPENAI_MODELS: { value: string; label: string }[] = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (fast)" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (cheap)" },
];

export const GEMINI_MODELS: { value: string; label: string }[] = [
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash (fast)" },
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash" },
];
