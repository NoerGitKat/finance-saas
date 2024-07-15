import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { insertAccountSchema } from "@/db/schema/accounts";

const app = new Hono()
  .get("/", clerkMiddleware(), async (context) => {
    const auth = getAuth(context);

    if (!auth?.userId) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        plaidId: accounts.plaidId,
        userId: accounts.userId,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return context.json({ accounts: data || [] }, 200);
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (context) => {
      const auth = getAuth(context);
      const formValues = context.req.valid("json");

      if (!auth?.userId) {
        return context.json({ error: "Unauthorized" }, 401);
      }

      const [newAccount] = await db
        .insert(accounts)
        .values({
          userId: auth.userId,
          ...formValues,
        })
        .returning();

      return context.json({ data: newAccount }, 200);
    },
  );

export default app;
