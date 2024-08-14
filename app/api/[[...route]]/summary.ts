import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillEmptyDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
      accountId: z.string().optional(),
    }),
  ),
  async (context) => {
    const auth = getAuth(context);
    const { fromDate, toDate, accountId } = context.req.valid("query");

    if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);

    const defaultToDate = new Date();
    const defaultFromDate = subDays(defaultToDate, 30);

    const startDate = fromDate
      ? parse(fromDate, "yyyy-MM-dd", new Date())
      : defaultFromDate;

    const endDate = toDate
      ? parse(toDate, "yyyy-MM-dd", new Date())
      : defaultToDate;

    const periodLength = differenceInDays(endDate, startDate) + 1;

    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const [currentPeriod] = await db
      .select({
        income:
          sql`SUM(CASE WHEN CAST(${transactions.amount} AS INTEGER) >= 0 THEN CAST(${transactions.amount} AS INTEGER) ELSE 0 END)`.mapWith(
            Number,
          ),
        expenses:
          sql`SUM(CASE WHEN CAST(${transactions.amount} AS INTEGER) < 0 THEN CAST(${transactions.amount} AS INTEGER) ELSE 0 END)`.mapWith(
            Number,
          ),
        // remaining: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      );

    const [lastPeriod] = await db
      .select({
        income:
          sql`SUM(CASE WHEN CAST(${transactions.amount} AS INTEGER) >= 0 THEN CAST(${transactions.amount} AS INTEGER) ELSE 0 END)`.mapWith(
            Number,
          ),
        expenses:
          sql`SUM(CASE WHEN CAST(${transactions.amount} AS INTEGER) < 0 THEN CAST(${transactions.amount} AS INTEGER) ELSE 0 END)`.mapWith(
            Number,
          ),
        // remaining: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, lastPeriodStart),
          lte(transactions.date, lastPeriodEnd),
        ),
      );

    const currentRemaining = currentPeriod.income + currentPeriod.expenses;
    const lastRemaining = lastPeriod.income + lastPeriod.expenses;

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income,
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses,
    );
    const remainingChange = calculatePercentageChange(
      currentRemaining,
      lastRemaining,
    );

    const categoryList = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(CAST(${transactions.amount} AS INTEGER)))`.mapWith(
          Number,
        ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(CAST(${transactions.amount} AS INTEGER)))`));

    const topCategories = categoryList.slice(0, 3);
    const otherCategories = categoryList.slice(3);
    const sumOtherCategories = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0,
    );

    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN CAST(${transactions.amount} AS INTEGER) >= 0 THEN CAST(${transactions.amount} AS INTEGER) ELSE 0 END)`.mapWith(
            Number,
          ),
        expenses:
          sql`SUM(CASE WHEN CAST(${transactions.amount} AS INTEGER) < 0 THEN CAST(${transactions.amount} AS INTEGER) ELSE 0 END)`.mapWith(
            Number,
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const days = fillEmptyDays(activeDays, startDate, endDate);

    return context.json({
      summary: {
        currentPeriod: { ...currentPeriod, remaining: currentRemaining },
        lastPeriod: { ...lastPeriod, remaining: lastRemaining },
        changes: { incomeChange, expensesChange, remainingChange },
        categories: {
          top: topCategories,
          other: {
            name: "Other",
            value: sumOtherCategories,
          },
        },
        days,
      },
    });
  },
);

export default app;
