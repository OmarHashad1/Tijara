import { create } from "zustand";

/** UI-only cart state — the cart itself lives on the server (TanStack Query). */
interface CartUiState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartUi = create<CartUiState>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
