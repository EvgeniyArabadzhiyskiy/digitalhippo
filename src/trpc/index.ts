import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { authRouter } from "./auth-router";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";

interface User {
  name: string;
  age: number;
  role: string;
}

const djonAdmin = {
  name: "Djon",
  age: 38,
  role: "Admin",
};

export const appRouter = router({
  anyApiRoutes: publicProcedure.query(() => {
    return djonAdmin;
  }),

  myNewRoute: publicProcedure.input(z.string()).query((opts) => {
    const { input } = opts;
    return input;
  }),

  auth: authRouter,
  getInfinityProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { cursor, query } = input;
      const { sort, limit, ...queryOpts } = query;

      const page = cursor || 1;

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      const payload = await getPayloadClient();

      const { docs: items, hasNextPage, nextPage } = await payload.find({
        collection: "products",
        depth: 1,
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOpts,
        },
        sort,
        limit,
        page,
      });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null
      };
    }),
});

export type AppRouter = typeof appRouter;
