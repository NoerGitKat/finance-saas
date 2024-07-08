import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Context, Hono } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get(
  "/hello",
  clerkMiddleware(),
  (context: Context<BlankEnv, "/api/hello", BlankInput>) => {
    const auth = getAuth(context);

    if (!auth?.userId) return context.json({ error: "Unauthorized" });

    return context.json({
      message: "Hello Next.js!",
      userId: auth.userId,
    });
  },
);

export const GET = handle(app);
export const POST = handle(app);
