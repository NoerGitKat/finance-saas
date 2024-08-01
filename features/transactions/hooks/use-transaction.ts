import { create } from "zustand";

type TransactionState = {
  id?: string;
  isOpen: boolean;
  openModal: (id: string) => void;
  closeModal: () => void;
};

export const useTransaction = create<TransactionState>((set) => ({
  id: "",
  isOpen: false,
  openModal: (id: string) =>
    set((prevState) => ({ isOpen: !prevState.isOpen, id })),
  closeModal: () => set({ isOpen: false, id: "" }),
}));
