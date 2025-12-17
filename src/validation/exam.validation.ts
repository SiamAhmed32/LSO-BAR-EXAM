import { z } from "zod";

export const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .refine(
      (options) => options.some((opt) => opt.isCorrect),
      "At least one option must be marked as correct"
    ),
});

export const createExamSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const createQuestionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .refine(
      (options) => options.some((opt) => opt.isCorrect),
      "At least one option must be marked as correct"
    ),
});

export const updateQuestionSchema = z.object({
  question: z.string().min(1, "Question text is required").optional(),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .refine(
      (options) => options.some((opt) => opt.isCorrect),
      "At least one option must be marked as correct"
    )
    .optional(),
});

export type OptionInput = z.infer<typeof optionSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

