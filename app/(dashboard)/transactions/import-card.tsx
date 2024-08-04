import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleCheck, CircleX, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportTable } from "./import-table";
import { useState } from "react";

// const dateFormat = "yyyy-MM-dd HH:mm:ss";
// const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "receiver", "notes", "date"];

export interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  cancelImport: () => void;
  importFile: (data: string[][]) => void;
};

export const ImportCard = ({ data, cancelImport, importFile }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {},
  );

  const headers = data[0];
  const body = data.slice(1);

  const changeTableHeadSelectOption = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;

      return newSelectedColumns;
    });
  };

  const importProgression =
    Object.values(selectedColumns).filter(Boolean).length;

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="line-clamp-1 flex text-xl">
          <Upload className="mr-2" />
          Import Transaction
        </CardTitle>
        <aside className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2">
          <Button
            onClick={cancelImport}
            size="sm"
            variant="destructive"
            className="w-full lg:w-auto"
          >
            <CircleX className="mr-2 size-4" /> Cancel
          </Button>
          <Button
            onClick={() => importFile(data)}
            size="sm"
            className="w-full bg-emerald-500 hover:bg-emerald-400 lg:w-auto"
            disabled={importProgression !== requiredOptions.length}
          >
            <CircleCheck className="mr-2 size-4" /> Import ({importProgression}/
            {requiredOptions.length})
          </Button>
        </aside>
      </CardHeader>
      <CardContent>
        <ImportTable
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={changeTableHeadSelectOption}
        />
      </CardContent>
    </Card>
  );
};
