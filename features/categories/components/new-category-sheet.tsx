import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { CategoryForm, FormValues } from "./category-form";
import useCreateOrEditCategory from "@/features/categories/api/use-create-edit-category";

export const NewCategorySheet = () => {
  const { isOpen, toggleSheet } = useNewCategory();

  const defaultValues = {
    name: "",
  };
  const mutation = useCreateOrEditCategory();

  const createNewCategory = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toggleSheet();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category for your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={createNewCategory}
          disabled={mutation.isPending}
          defaultValues={defaultValues}
        />
      </SheetContent>
    </Sheet>
  );
};
