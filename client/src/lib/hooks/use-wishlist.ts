"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "@/lib/api/wishlist";
import { apiErrorMessage } from "@/lib/api/client";
import { useUser } from "./use-user";

export function useWishlist() {
  const { isLoggedIn } = useUser();

  const query = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: isLoggedIn,
  });

  function contains(productId: string) {
    return Boolean(
      query.data?.productIds.some((product) => product._id === productId),
    );
  }

  return { ...query, contains };
}

export function useToggleWishlistItem() {
  const queryClient = useQueryClient();
  const { contains } = useWishlist();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (contains(productId)) {
        await removeWishlistItem(productId);
        return "removed" as const;
      }
      await addWishlistItem(productId);
      return "added" as const;
    },
    onSuccess: (action) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        action === "added" ? "Saved to your wishlist." : "Removed from wishlist.",
      );
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
}
