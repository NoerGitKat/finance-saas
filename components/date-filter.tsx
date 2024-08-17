"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";

import { useSearchParams } from "next/navigation";

import { Button } from "./ui/button";
import { formatDateRange } from "@/lib/utils";
import { useSummaryDate } from "@/features/summary/hooks/use-summary-date";
import { subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Calendar } from "./ui/calendar";
import useGetSummary from "@/features/summary/api/use-get-summary";

export const DateFilter = () => {
  const { isLoading: isLoadingSummary } = useGetSummary();
  const params = useSearchParams();
  const accountId = params.get("accountId") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const { date, pushToUrl, setDate, resetDates } = useSummaryDate(paramState, {
    to: defaultTo,
    from: defaultFrom,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoadingSummary}
          size="sm"
          variant="outline"
          className="h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto"
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 lg:w-auto" align="start">
        <Calendar
          disabled={isLoadingSummary}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="flex w-full items-center gap-x-2 p-4">
          <PopoverClose asChild>
            <Button
              onClick={resetDates}
              disabled={!date?.from || !date?.to}
              className="w-full"
              variant="outline"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date, accountId)}
              disabled={!date?.from || !date?.to}
              className="w-full"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
