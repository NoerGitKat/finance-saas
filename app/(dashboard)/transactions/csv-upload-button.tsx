import { Button } from "@/components/ui/button";
import { ImportResults } from "@/constants/consts";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type Props = {
  uploadCSV: (results: ImportResults) => void;
};

export const CsvUploadButton = ({ uploadCSV }: Props) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={uploadCSV}>
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ getRootProps }: any) => (
          <Button
            variant="secondary"
            size="sm"
            className="w-full lg:w-auto"
            {...getRootProps()}
          >
            <Upload className="mr-2 size-4" /> Import
          </Button>
        )
      }
    </CSVReader>
  );
};
