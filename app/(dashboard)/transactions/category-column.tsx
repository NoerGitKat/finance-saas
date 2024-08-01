import { useCategory } from "@/features/categories/hooks/use-category";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  category: string;
  categoryId: string | null;
};

export const CategoryColumn = ({ category, categoryId }: Props) => {
  const { openModal } = useCategory();

  const onClick = () => {
    if (categoryId) openModal(categoryId);
  };
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center hover:underline",
        !category && "text-rose-500",
      )}
    >
      {!category && <TriangleAlert className="mr-1 size-4 shrink-0" />}
      {category || <i>Uncategorized</i>}
    </div>
  );
};
