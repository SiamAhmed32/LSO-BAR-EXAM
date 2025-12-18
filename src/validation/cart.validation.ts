import { z } from "zod";

export const addToCartSchema = z.object({
  questionId: z.string().uuid("Invalid question ID format"),
  examId: z.string().uuid("Invalid exam ID format"),
});

export const removeFromCartSchema = z.object({
  questionId: z.string().uuid("Invalid question ID format"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;