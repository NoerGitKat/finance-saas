import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";
import { accounts } from "./accounts";
import { categories } from "./categories";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey().$defaultFn(createId),
  amount: integer("amount").notNull(),
  receiver: text("receiver").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

export type Transaction = typeof transactions.$inferSelect & {
  account: string;
  category: string;
};
export type NewTransaction = typeof transactions.$inferInsert;
