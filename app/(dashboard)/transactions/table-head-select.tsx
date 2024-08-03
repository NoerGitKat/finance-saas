import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  changeTableHead: (columnIndex: number, value: string | null) => void;
};

const options = ["amount", "receiver", "notes", "date"];

export const TableHeadSelect = ({
  columnIndex,
  selectedColumns,
  changeTableHead,
}: Props) => {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelection || ""}
      onValueChange={(value) => changeTableHead(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "border-none bg-transparent capitalize outline-none focus:ring-transparent focus:ring-offset-0",
          currentSelection && "text-emerald-500",
        )}
      >
        {currentSelection && <CircleCheck className="mr-1 size-4" />}
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option) => {
          const isDisabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column_${columnIndex}`] !== option;

          return (
            <SelectItem
              key={option}
              className="capitalize"
              value={option}
              disabled={isDisabled}
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
