import { User } from "@/payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const payloadToken = cookies.get("payload-token")?.value || null;

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
