import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(6).max(50),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(50),
});

export const sendOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
