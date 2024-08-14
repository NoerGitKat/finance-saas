import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(value: number, isMiliunit?: boolean) {
  let amount = value;
  if (isMiliunit) {
    amount = convertAmountFromMiliunits(value);
  }
  return Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function fillEmptyDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day) => {
    const foundDay = activeDays.find((activeDay) =>
      isSameDay(activeDay.date, day),
    );

    if (foundDay) {
      return foundDay;
    } else {
      return { date: day, income: 0, expenses: 0 };
    }
  });

  return transactionsByDay;
}

type Period = {
  fromDate: string | Date | undefined;
  toDate: string | Date | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.fromDate) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period.toDate) {
    return `${format(period.fromDate, "LLL dd")} - ${format(period.toDate, "LLL dd, y")}`;
  }

  return format(period.fromDate, "LLL dd");
}
