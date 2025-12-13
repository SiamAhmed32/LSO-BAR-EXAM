import {z} from "zod";

export const contactValidationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email(),
  message: z.string().min(3).max(50),
});

export type ContactValidation = z.infer<typeof contactValidationSchema>;