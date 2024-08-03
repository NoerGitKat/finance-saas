import { INITIAL_IMPORT_RESULTS } from "@/constants/consts";
import { Variants } from "@/constants/enums";
import { useState } from "react";

export const useImportCSV = () => {
  const [variant, setVariants] = useState<Variants>(Variants.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const uploadCSV = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariants(Variants.IMPORT);
    setImportResults(results);
  };

  const cancelImport = () => {
    setVariants(Variants.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  return { variant, uploadCSV, importResults, cancelImport };
};
