import { User } from "@/payload-types";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ResponseCookies
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
