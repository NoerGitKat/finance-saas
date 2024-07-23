import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";

export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(createId),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const insertCategoriesSchema = createInsertSchema(categories);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
