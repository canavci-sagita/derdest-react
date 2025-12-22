import { generateProtectedRoutes } from "@/lib/utils/route.utils";
import { navigationMenu } from "./navigation.config";

export const publicRoutes: string[] = [
  "/checkout/success",
  "/checkout/cancel",
  "/redirect",
  "/public",
];

export const protectedRoutes: Record<string, string[]> = {
  "/": ["*"],
  ...generateProtectedRoutes(navigationMenu),
};

export const matchesProtectedRoute = (path: string): string | undefined => {
  return Object.keys(protectedRoutes)
    .sort((a, b) => {
      const aIsDynamic = a.includes("[");
      const bIsDynamic = b.includes("[");
      if (aIsDynamic && !bIsDynamic) return 1;
      if (!aIsDynamic && bIsDynamic) return -1;
      return b.length - a.length; // Longest first
    })
    .find((routePattern) => {
      if (routePattern === path) return true;

      // NOTE: Convert Next.js route pattern to Regex for dynamic matching.
      // Escape slashes and replace [param] with a capture group that stops at the next slash.
      const regexSource =
        "^" +
        routePattern.replace(/\//g, "\\/").replace(/\[.*?\]/g, "([^/]+)") +
        "$";

      return new RegExp(regexSource).test(path);
    });
};
