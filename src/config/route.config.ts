import { generateProtectedRoutes } from "@/lib/utils/route.utils";
import { navigationMenu } from "./navigation.config";

export const publicRoutes: string[] = [
  "/checkout/success",
  "/checkout/cancel",
  "/redirect",
];

export const protectedRoutes: Record<string, string[]> = {
  // Manually add any special cases, like allowing all authenticated users for the homepage
  "/": ["*"],
  // Automatically generate the rest from the navigation menu
  ...generateProtectedRoutes(navigationMenu),
};
