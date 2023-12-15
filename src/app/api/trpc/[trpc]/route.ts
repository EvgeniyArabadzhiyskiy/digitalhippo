import { appRouter } from "@/trpc";
import { ExpressContext } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: "/api/trps",
    req,
    router: appRouter,
    createContext: () => {
      return {} as ExpressContext;
    },
  });
};

export { handler as GET, handler as POST };
