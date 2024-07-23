import { create } from "zustand";

type AccountState = {
  id?: string;
  isOpen: boolean;
  openModal: (id: string) => void;
  closeModal: () => void;
};

export const useAccount = create<AccountState>((set) => ({
  id: "",
  isOpen: false,
  openModal: (id: string) =>
    set((prevState) => ({ isOpen: !prevState.isOpen, id })),
  closeModal: () => set({ isOpen: false, id: undefined }),
}));
