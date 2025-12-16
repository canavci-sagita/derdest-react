import { cache } from "react";
import { getClientAction } from "../clients.actions";

export const getClientCached = cache(async (id: number) => {
  return await getClientAction(id);
});
