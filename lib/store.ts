import { create } from "zustand";

interface UIState {
  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Chat
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;
}

export const useStore = create<UIState>()((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  selectedThreadId: null,
  setSelectedThreadId: (id) => set({ selectedThreadId: id }),
}));
