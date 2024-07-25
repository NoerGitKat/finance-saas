import { create } from "zustand";

type NewTransactionState = {
  isOpen: boolean;
  toggleSheet: () => void;
};

export const useNewTransaction = create<NewTransactionState>((set) => ({
  isOpen: false,
  toggleSheet: () => set((prevState) => ({ isOpen: !prevState.isOpen })),
}));
