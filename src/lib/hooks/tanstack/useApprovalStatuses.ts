"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllApprovalStatusesAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";

export const useApprovalStatuses = () => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["approval-statuses"],
    queryFn: () => getAllApprovalStatusesAction(),
  });
};
