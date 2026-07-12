"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import { apiErrorMessage } from "@/lib/api/client";
import { useUser } from "./use-user";

export function useCart() {
  const { isLoggedIn } = useUser();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isLoggedIn,
  });

  const itemCount =
    query.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return { ...query, itemCount };
}

/** All cart mutations invalidate the cart query and toast API errors. */
function useCartMutation<TInput>(
  mutationFn: (input: TInput) => Promise<void>,
  successMessage?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (successMessage) toast.success(successMessage);
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
}

export function useAddCartItem() {
  return useCartMutation(addCartItem, "Added to your cart.");
}

export function useUpdateCartItem() {
  return useCartMutation(updateCartItem);
}

export function useRemoveCartItem() {
  return useCartMutation(removeCartItem);
}

export function useClearCart() {
  return useCartMutation(clearCart, "Cart cleared.");
}
