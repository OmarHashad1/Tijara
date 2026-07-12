import { api, unwrap } from "./client";
import type { Address, PaymentMethod } from "./types";

/* ---- Profile ---- */

export async function updateProfile(input: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) {
  await api.patch("/user/me", input);
}

export async function changePassword(input: {
  oldPassword: string;
  newPassword: string;
}) {
  await api.patch("/user/me/password", input);
}

export async function deleteAccount() {
  await api.delete("/user/me");
}

/* ---- Addresses ---- */

export async function listAddresses(): Promise<Address[]> {
  const res = await api.get("/user/me/addresses");
  return unwrap<Address[]>(res.data);
}

export async function addAddress(input: {
  city: string;
  country: string;
  isDefault?: boolean;
}) {
  await api.post("/user/me/addresses", input);
}

export async function updateAddress(input: {
  addressId: string;
  city?: string;
  country?: string;
  isDefault?: boolean;
}) {
  const { addressId, ...body } = input;
  await api.patch(`/user/me/addresses/${addressId}`, body);
}

export async function deleteAddress(addressId: string) {
  await api.delete(`/user/me/addresses/${addressId}`);
}

/* ---- Payment methods ---- */

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await api.get("/user/me/payment-methods");
  return unwrap<PaymentMethod[]>(res.data);
}

export async function addPaymentMethod(input: {
  method: "card" | "POD";
  last4: number;
  isDefault?: boolean;
}) {
  await api.post("/user/me/payment-methods", input);
}

export async function deletePaymentMethod(paymentMethodId: string) {
  await api.delete(`/user/me/payment-methods/${paymentMethodId}`);
}
