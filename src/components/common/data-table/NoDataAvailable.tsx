"use client";

import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "../ui/AppIcon";
import { twMerge } from "tailwind-merge";

type NoDataAvailableProps = {
  border?: boolean;
  containerClassName?: string;
};

const NoDataAvailable: React.FC<NoDataAvailableProps> = (
  props: NoDataAvailableProps
) => {
  const { t } = useTranslation();

  const { border, containerClassName } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center gap-1 rounded py-2",
        border && "border-2 border-dashed border-slate-200",
        containerClassName
      )}
    >
      <AppIcon className="stroke-[0.5] text-slate-400 w-8 h-8" icon="Inbox" />
      <p className="text-slate-400 text-center text-sm">
        {t("noDataAvailable")}
      </p>
    </div>
  );
};

export default NoDataAvailable;
