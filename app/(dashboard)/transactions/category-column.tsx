import { useCategory } from "@/features/categories/hooks/use-category";
import { useTransaction } from "@/features/transactions/hooks/use-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  category: string;
  categoryId: string | null;
  transactionId: string;
};

export const CategoryColumn = ({
  category,
  categoryId,
  transactionId,
}: Props) => {
  const categoryModal = useCategory();
  const transactionModal = useTransaction();

  const onClick = () => {
    if (categoryId) {
      categoryModal.openModal(categoryId);
    } else {
      transactionModal.openModal(transactionId);
    }
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
