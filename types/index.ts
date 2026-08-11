export interface ApiKeys {
  openai?: string;
  gemini?: string;
}

export interface ParsedDocument {
  id: string;
  name: string;
  type: "pdf" | "txt" | "docx";
  content: string;
  size: number;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  documentId: string;
  documentName: string;
  messages: ChatMessage[];
  createdAt: Date;
  provider: "openai" | "gemini";
  model: string;
}

export type AiProvider = "openai" | "gemini";

export type AiModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-3.5-turbo"
  | "gemini-1.5-pro"
  | "gemini-1.5-flash"
  | "gemini-2.0-flash-exp";

export interface UserProfile {
  id: string;
  email: string;
  isPaid: boolean;
  createdAt: string;
}
