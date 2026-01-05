import { z } from "zod";

export const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  explanation: z.string().optional(),
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
  price: z.number().positive("Price must be a positive number").optional(),
  examTime: z.string().min(1, "Exam time is required").optional(),
  attemptCount: z.number().int().positive("Attempt count must be a positive integer").optional(),
});

export const createQuestionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  explanation: z.string().optional(),
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
  explanation: z.string().optional(),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .refine(
      (options) => options.some((opt) => opt.isCorrect),
      "At least one option must be marked as correct"
    )
    .optional(),
});

export const submitExamSchema = z.object({
  examId: z.string().uuid("Invalid exam ID"),
  totalQuestions: z.number().int().positive("Total questions must be positive"),
  answeredCount: z.number().int().min(0, "Answered count cannot be negative"),
  correctCount: z.number().int().min(0, "Correct count cannot be negative"),
  incorrectCount: z.number().int().min(0, "Incorrect count cannot be negative"),
  unansweredCount: z.number().int().min(0, "Unanswered count cannot be negative"),
  score: z.number().min(0).max(100, "Score must be between 0 and 100"),
  answers: z.record(z.string(), z.any()), // JSON object storing user answers
});

export type OptionInput = z.infer<typeof optionSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type SubmitExamInput = z.infer<typeof submitExamSchema>;

