import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { subDays, parse } from "date-fns";
import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema/transactions";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .get(
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

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          receiver: transactions.receiver,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .orderBy(desc(transactions.date));

      return context.json({ transactions: data || [] }, 200);
    },
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!id) return context.json({ error: "Missing transaction ID" }, 400);

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          receiver: transactions.receiver,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
        .orderBy(desc(transactions.date));

      if (!data)
        return context.json({ error: "Couldn't find transaction." }, 404);

      return context.json({ transaction: data || [] }, 200);
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      }),
    ),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!values)
        return context.json({ error: "Missing transaction details!" }, 422);

      try {
        const [data] = await db
          .insert(transactions)
          .values({
            id: createId(),
            ...values,
          })
          .returning();

        return context.json({ transactions: data }, 201);
      } catch (error) {
        return context.json({ error }, 400);
      }
    },
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!values)
        return context.json({ error: "No transactions to be added" }, 422);

      try {
        const data = await db
          .insert(transactions)
          .values(
            values.map((value) => ({
              id: createId(),
              ...value,
            })),
          )
          .returning();

        return context.json({ transactions: data }, 201);
      } catch (error) {
        return context.json({ error }, 400);
      }
    },
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId),
            ),
          ),
      );

      try {
        const [data] = await db
          .with(transactionsToDelete)
          .delete(transactions)
          .where(
            inArray(
              transactions.id,
              sql`(SELECT id FROM ${transactionsToDelete})`,
            ),
          )
          .returning({
            id: transactions.id,
          });

        return context.json({ transactions: data }, 201);
      } catch (error) {
        return context.json({ error }, 400);
      }
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      }),
    ),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");
      const values = context.req.valid("json");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!id) return context.json({ error: "Missing transaction ID!" }, 400);
      if (!values)
        return context.json({ error: "Missing transaction details!" }, 422);

      const transactionToUpdate = db.$with("transaction_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(eq(transactions.id, id), eq(accounts.userId, auth.userId)),
          ),
      );

      try {
        const [data] = await db
          .with(transactionToUpdate)
          .update(transactions)
          .set(values)
          .where(
            inArray(
              transactions.id,
              sql`(SELECT id FROM ${transactionToUpdate})`,
            ),
          )
          .returning();

        return context.json({ transaction: data }, 201);
      } catch (error) {
        return context.json({ error }, 400);
      }
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!id) return context.json({ error: "Missing transaction ID!" }, 400);

      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(eq(transactions.id, id), eq(accounts.userId, auth.userId)),
          ),
      );

      try {
        const [data] = await db
          .with(transactionToDelete)
          .delete(transactions)
          .where(
            inArray(
              transactions.id,
              sql`(SELECT id FROM ${transactionToDelete})`,
            ),
          )
          .returning({
            id: transactions.id,
          });

        return context.json({ transaction: data }, 201);
      } catch (error) {
        return context.json({ error }, 400);
      }
    },
  );

export default app;
