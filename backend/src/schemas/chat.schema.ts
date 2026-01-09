import { z } from "zod";

export const ChatRoleSchema = z.enum(["user", "assistant"]);

export const ChatMessageInputSchema = z.object({
  role: ChatRoleSchema,
  content: z.string().min(1).max(4000),
});

export const ChatRequestSchema = z.object({
  mode: z.enum(["global", "recipe"]).default("global"),
  messages: z.array(ChatMessageInputSchema).min(1).max(50),
  recipeId: z.string().min(1).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageInputSchema>;

export const ChatResponseSchema = z.object({
  message: z.object({
    role: z.literal("assistant"),
    content: z.string().min(1),
  }),
});
