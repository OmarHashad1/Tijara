import { z } from "zod";

/** Mirrors the backend's @IsStrongPassword rule (signup/reset DTOs). */
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one symbol");

const nameSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(16, "At most 16 characters");

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.email("Enter a valid email"),
  password: passwordSchema,
  phoneNumber: z.string().optional(),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "The code is 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, "The code is 6 digits"),
  newPassword: passwordSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
