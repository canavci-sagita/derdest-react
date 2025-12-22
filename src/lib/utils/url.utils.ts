import { headers } from "next/headers";

export const getAbsoluteUrl = async (path: string) => {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  return `${protocol}://${host}${path}`;
};
