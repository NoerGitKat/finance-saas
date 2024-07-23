import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { insertCategoriesSchema } from "@/db/schema/categories";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", clerkMiddleware(), async (context) => {
    const auth = getAuth(context);

    if (!auth?.userId) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
        plaidId: categories.plaidId,
        userId: categories.userId,
      })
      .from(categories)
      .where(eq(categories.userId, auth.userId));

    return context.json({ categories: data || [] }, 200);
  })
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

      if (!id) {
        return context.json({ error: "Missing categorie ID" }, 400);
      }
      if (!auth?.userId) {
        return context.json({ error: "Unauthorized" }, 401);
      }
      const [category] = await db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          plaidId: categories.plaidId,
          userId: categories.userId,
        })
        .from(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)));

      if (!category)
        return context.json(
          { error: "No category associated with this ID" },
          404,
        );
      return context.json({ data: category }, 200);
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategoriesSchema.pick({ name: true })),
    async (context) => {
      const auth = getAuth(context);
      const formValues = context.req.valid("json");

      if (!auth?.userId) {
        return context.json({ error: "Unauthorized" }, 401);
      }

      const [newCategory] = await db
        .insert(categories)
        .values({
          userId: auth.userId,
          ...formValues,
        })
        .returning();

      return context.json({ data: newCategory }, 200);
    },
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (context) => {
      const auth = getAuth(context);
      const values = context.req.valid("json");

      if (!auth?.userId) {
        return context.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids),
          ),
        )
        .returning({
          id: categories.id,
        });

      return context.json({ data }, 200);
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertCategoriesSchema.pick({ name: true })),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");
      const values = context.req.valid("json");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!id) return context.json({ error: "Missing category ID." }, 400);

      try {
        const [data] = await db
          .update(categories)
          .set(values)
          .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
          .returning();

        if (!data)
          return context.json({ error: "Couldn't find category..." }, 404);

        return context.json({ data }, 200);
      } catch (error) {
        return context.json({ error: "Couldn't update category..." }, 304);
      }
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (context) => {
      const auth = getAuth(context);
      const { id } = context.req.valid("param");

      if (!auth?.userId) return context.json({ error: "Unauthorized" }, 401);
      if (!id) return context.json({ error: "Missing category ID." }, 400);

      try {
        const [data] = await db
          .delete(categories)
          .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
          .returning({ id: categories.id, name: categories.name });

        if (!data)
          return context.json({ error: "Couldn't find category..." }, 404);

        return context.json(data, 200);
      } catch (error) {
        return context.json({ error: "Couldn't update category..." }, 304);
      }
    },
  );

export default app;
