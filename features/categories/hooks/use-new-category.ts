import { create } from "zustand";

type NewCategoryState = {
  isOpen: boolean;
  toggleSheet: () => void;
};

export const useNewCategory = create<NewCategoryState>((set) => ({
  isOpen: false,
  toggleSheet: () => set((prevState) => ({ isOpen: !prevState.isOpen })),
}));
