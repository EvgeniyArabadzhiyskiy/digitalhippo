import path from "path";
import express from "express";
import bodyParser from "body-parser";
import nextBuild from "next/dist/build";
import { IncomingMessage } from "http";
import * as trpcExpress from "@trpc/server/adapters/express";

import { appRouter } from "./trpc";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import { inferAsyncReturnType } from "@trpc/server";
import { stripeWebhookHandler } from "./webhooks";
import { PayloadRequest } from "payload/types";
import { parse } from "url";
import cookieParser from "cookie-parser";
import { User } from "./payload-types";

import { mediaManagement } from "payload-cloudinary-plugin";

// const CLOUD_NAME = "dlc78cjak";
// const CLOUDINARY_API_KEY = "292122393664487";
// const CLOUDINARY_API_SECRET = "XqU0DMQVO7jf-P1CWoZBY9KvxYg";

const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// https://github.com/payloadcms/payload/blob/main/examples/custom-server/src/server.ts

const getServerUser = async (payloadToken: any) => {
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${payloadToken}`,
      },
    }
  );

  const { user, token } = (await meRes.json()) as {
    user: User | null;
    token: string | undefined;
  };

  return { user, token };
};

const app = express();
app.use(cookieParser());

app.use(
  mediaManagement(  
    {
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    },
    
    {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      folder: "dijitalhippo",
      // transformation: [
      //   { width: 250, height: 250, gravity: "faces", crop: "thumb" },
      //   { radius: "max" },
      // ],
    }
  )
);

const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, res, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Payload Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  const cartRouter = express.Router();

  cartRouter.use(payload.authenticate);
  // cartRouter.use((req, res, next) => payload.authenticate(req, res, next));

  cartRouter.get("/", (req, res) => {
    const request = req as PayloadRequest;

    if (!request.user) return res.redirect("/sign-in?origin=cart");

    const parseUrl = parse(req.url, true);

    return nextApp.render(req, res, "/cart", parseUrl.query);
  });

  app.use("/cart", cartRouter);

  const authRouter = express.Router();
  // authRouter.use(payload.authenticate);   // Можно вместо const { user } = await getServerUser(token);

  authRouter.get("/:page(sign-in|sign-up)", async (req, res) => {
    const { page } = req.params;
    const token = req.cookies["payload-token"] || null;

    const { user } = await getServerUser(token);

    if (user) return res.redirect(`/`);

    // const parseUrl = parse(req.url, true);
    return nextApp.render(req, res, `/${page}`);
  });

  app.use("/", authRouter);

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
