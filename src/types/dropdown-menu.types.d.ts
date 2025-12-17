import { AppIconName } from "@/components/common/ui/AppIcon";
import type { icons } from "lucide-react";

const { icons } = lucideIcons;

type PopconfirmProps = {
  title: string;
  description: string;
  onConfirm: () => void;
};

export interface DropdownMenuItem {
  type: "item";
  icon: AppIconName;
  extra?: AppIconName;
  iconClassName?: string;
  key: string;
  label: string | ReactNode;
  labelClassName?: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  popconfirm?: PopconfirmProps;
  children?: DropdownMenuItem[];
  roles?: string[];
}

export interface DropdownMenuDivider {
  type: "divider";
}

export type DropdownMenuEntry = DropdownMenuItem | DropdownMenuDivider;
