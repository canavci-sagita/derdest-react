import { icons } from "@/components/common/ui/AppIcon";

export interface NavigationLink {
  type: "link";
  icon: keyof typeof icons;
  title: string;
  path: string;
  badge?: number;
  subItems?: NavigationLink[];
  roles?: string[];
  routeOnly?: boolean;
}

export interface NavigationHeader {
  type: "header";
  title: string;
  roles?: string[];
}

export type NavigationEntry = NavigationLink | NavigationHeader;
