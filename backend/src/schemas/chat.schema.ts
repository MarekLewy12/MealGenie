import { z } from "zod";

export const ChatRoleSchema = z.enum(["user", "assistant"]);

export const ChatMessageInputSchema = z.object({
  role: ChatRoleSchema,
  content: z
    .string()
    .min(1, "Wiadomość nie może być pusta")
    .max(8000, "Wiadomość jest za długa"),
});

const GlobalChatSchema = z.object({
  mode: z.literal("global"),
  messages: z.array(ChatMessageInputSchema).min(1).max(50),
});

const RecipeChatSchema = z.object({
  mode: z.literal("recipe"),
  recipeId: z.string().uuid("recipeId musi być poprawnym UUID"),
  messages: z.array(ChatMessageInputSchema).min(1).max(50),
});

export const ChatRequestSchema = z.union([GlobalChatSchema, RecipeChatSchema]);

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageInputSchema>;
export type GlobalChatRequest = z.infer<typeof GlobalChatSchema>;
export type RecipeChatRequest = z.infer<typeof RecipeChatSchema>;

export const ChatResponseSchema = z.object({
  message: z.object({
    role: z.literal("assistant"),
    content: z.string().min(1),
  }),
});
