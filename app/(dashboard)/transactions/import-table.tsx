import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export const ImportTable = ({
  headers,
  body,
  selectedColumns,
  onTableHeadSelectChange,
}: Props) => {
  return (
    <section className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={header}>
                <TableHeadSelect
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  changeTableHead={onTableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, i) => (
                <TableCell key={i}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
