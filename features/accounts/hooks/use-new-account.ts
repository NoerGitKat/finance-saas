import { create } from "zustand";

type NewAccountState = {
  isOpen: boolean;
  toggleSheet: () => void;
};

export const useNewAccount = create<NewAccountState>((set) => ({
  isOpen: false,
  toggleSheet: () => set((prevState) => ({ isOpen: !prevState.isOpen })),
}));
