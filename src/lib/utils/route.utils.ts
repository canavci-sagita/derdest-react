import { NavigationEntry } from "@/types/navigation-menu.types";

/**
 * Recursively flattens the navigation menu and extracts all routes
 * that have role-based permissions defined.
 * @param items The array of navigation entries to process.
 * @returns A Record where keys are paths and values are the required roles.
 */
const extractProtectedRoutes = (
  items: NavigationEntry[]
): Record<string, string[]> => {
  let routes: Record<string, string[]> = {};

  for (const item of items) {
    if (item.type === "link") {
      if (item.roles && item.roles.length > 0) {
        routes[item.path] = item.roles;
      }
      // If the link has sub-items, recurse into them.
      if (item.subItems) {
        const subRoutes = extractProtectedRoutes(item.subItems);
        routes = { ...routes, ...subRoutes };
      }
    }
  }

  return routes;
};

/**
 * Generates the protectedRoutes configuration object from the navigation menu.
 * @param navigationMenu The navigation menu configuration array.
 * @returns A Record mapping protected routes to their required roles.
 */
export const generateProtectedRoutes = (
  navigationMenu: NavigationEntry[]
): Record<string, string[]> => {
  return extractProtectedRoutes(navigationMenu);
};
