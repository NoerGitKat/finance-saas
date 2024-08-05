import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleCheck, CircleX, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportTable } from "./import-table";
import { useState } from "react";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { NewTransaction } from "@/db/schema";

const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "receiver", "notes", "date"];

export interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  cancelImport: () => void;
  storeTransactionsInDB: (data: NewTransaction[]) => void;
};

export const ImportCard = ({
  data,
  cancelImport,
  storeTransactionsInDB,
}: Props) => {
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

  const handleImport = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`];
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const dataArray = mappedData.body.map((row) => {
      return row.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: any, cell, index) => {
          const header = mappedData.headers[index];

          if (header !== null && header !== undefined) {
            acc[header] = cell;
          }

          return acc;
        },
        { notes: "", receiver: "", amount: 0, date: "" },
      );
    });

    const formattedData = dataArray.map((transaction) => {
      return {
        ...transaction,
        amount: convertAmountToMiliunits(transaction.amount),
        date: new Date(format(parseISO(transaction.date), outputFormat)),
      };
    });

    storeTransactionsInDB(formattedData);
  };

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
            onClick={handleImport}
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
