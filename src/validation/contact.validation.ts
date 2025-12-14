import {z} from "zod";

export const contactValidationSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.email(),
  message: z.string().min(10).max(2000),
});

export type ContactValidation = z.infer<typeof contactValidationSchema>;