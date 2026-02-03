export type ChatRole = "user" | "assistant";
export type ChatMode = "global" | "recipe";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export type ChatRequest =
  | {
      mode: "global";
      messages: { role: ChatRole; content: string }[];
    }
  | {
      mode: "recipe";
      recipeId: string;
      messages: { role: ChatRole; content: string }[];
    };

export interface ChatResponse {
  message: {
    role: "assistant";
    content: string;
  };
}

export interface RecipeChatContext {
  recipeId: string;
  recipeName: string;
  recipeImageUrl?: string;
}

export type SessionKey = "global" | `recipe:${string}`;

export function createSessionKey(
  mode: ChatMode,
  recipeId?: string,
): SessionKey {
  if (mode === "recipe" && recipeId) {
    return `recipe:${recipeId}`;
  }
  return "global";
}

export function parseSessionKey(
  key: SessionKey,
): { mode: ChatMode; recipeId?: string } {
  if (key === "global") {
    return { mode: "global" };
  }
  const recipeId = key.replace("recipe:", "");
  return { mode: "recipe", recipeId };
}
