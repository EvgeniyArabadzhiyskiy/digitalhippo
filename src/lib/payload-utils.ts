import { cookies } from "next/headers";

export const getServerSideUser = () => {
  const token = cookies().get("payload-token")?.value || null;

  return token;
};
