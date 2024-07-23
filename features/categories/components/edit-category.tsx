import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCategory } from "@/features/categories/hooks/use-category";
import { CategoryForm, FormValues } from "./category-form";
import useCreateorEditCategory from "@/features/categories/api/use-create-edit-category";
import useGetCategory from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import useDeleteCategory from "../api/use-delete-category";
import { useConfirmAction } from "@/hooks";

export const EditCategorySheet = () => {
  const { isOpen, closeModal, id } = useCategory();
  const [ConfirmationDialog, confirmAction] = useConfirmAction(
    "Are you sure?",
    `You are about to delete`,
    "this category",
  );

  const { data: currentCategory, isLoading } = useGetCategory(id);
  const editMutation = useCreateorEditCategory(id);
  let defaultValues = {
    name: "",
  };
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const editCategory = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const deleteCategory = async () => {
    const isConfirmed = await confirmAction();

    if (isConfirmed) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  if (currentCategory) {
    defaultValues = {
      name: currentCategory.name,
    };
  }

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={closeModal}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit this category.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={editCategory}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={deleteCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
