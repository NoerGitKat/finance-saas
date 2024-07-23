import { create } from "zustand";

type CategoryState = {
  id?: string;
  isOpen: boolean;
  openModal: (id: string) => void;
  closeModal: () => void;
};

export const useCategory = create<CategoryState>((set) => ({
  id: "",
  isOpen: false,
  openModal: (id: string) =>
    set((prevState) => ({ isOpen: !prevState.isOpen, id })),
  closeModal: () => set({ isOpen: false, id: undefined }),
}));
