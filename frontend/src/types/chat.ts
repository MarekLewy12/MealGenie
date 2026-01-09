export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface ChatRequest {
  mode: "global" | "recipe";
  recipeId?: string;
  messages: { role: ChatRole; content: string }[];
}

export interface ChatResponse {
  message: {
    role: "assistant";
    content: string;
  };
}
