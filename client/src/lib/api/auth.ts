import axios from "axios";
import { api, unwrap } from "./client";
import type { User } from "./types";

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export async function login(input: { email: string; password: string }) {
  await api.post("/auth/login", input);
}

export async function signup(input: SignupInput) {
  await api.post("/auth/signup", input);
}

export async function sendVerifyEmailOtp() {
  await api.post("/auth/send-verify-email");
}

export async function checkVerifyEmailOtp(otp: string) {
  await api.post("/auth/check-verify-email", { otp });
}

export async function sendForgotPasswordOtp(email: string) {
  await api.post("/auth/send-forgot-password-otp", { email });
}

export async function verifyForgotPasswordOtp(input: {
  email: string;
  otp: string;
}) {
  await api.post("/auth/verify-forgot-password-otp", input);
}

export async function resetPassword(input: {
  email: string;
  newPassword: string;
}) {
  await api.patch("/auth/reset-password", input);
}

/**
 * Session probe: null means "not logged in" (or email not yet verified —
 * /user/me sits behind the email-verified guard). Other failures propagate.
 */
export async function getMe(): Promise<User | null> {
  try {
    const res = await api.get("/user/me", { skipAuthRedirect: true });
    return unwrap<User>(res.data);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      return null;
    }
    throw error;
  }
}

export async function logout() {
  await api.post("/user/logout", { type: "device" });
}
