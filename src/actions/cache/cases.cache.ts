import { cache } from "react";
import { getCaseSummaryAction } from "../cases.actions";

export const getCaseSummaryCached = cache(async (id: number) => {
  return await getCaseSummaryAction(id);
});
