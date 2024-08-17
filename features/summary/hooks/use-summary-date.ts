import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type Period = { from: Date; to: Date };

export const useSummaryDate = (period: Period, defaultRange: Period) => {
  const [date, setDate] = useState<DateRange | undefined>(period);
  const router = useRouter();
  const pathname = usePathname();

  const pushToUrl = (
    dateRange: DateRange | undefined,
    accountId: string | undefined,
  ) => {
    const query = {
      from: format(dateRange?.from || defaultRange.from, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultRange.to, "yyyy-MM-dd"),
      accountId,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  };

  const resetDates = () => {
    setDate(undefined);
    pushToUrl(undefined, undefined);
  };

  return { date, pushToUrl, resetDates, setDate };
};
