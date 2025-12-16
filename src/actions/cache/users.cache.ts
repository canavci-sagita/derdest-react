import { cache } from "react";
import { getUserAction } from "../users.actions";

export const getUserCached = cache(async (id: number) => {
  return await getUserAction(id);
});
