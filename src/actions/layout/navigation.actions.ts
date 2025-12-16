import { navigationMenu } from "@/config/navigation.config";
import { NavigationEntry } from "@/types/navigation-menu.types";
import { getAuthenticatedUser } from "@/lib/session";

/**
 * A Server Action that gets the authorized navigation menu for the current user.
 * This is safe to call from a Server Component during render.
 * @returns A promise that resolves to an array of authorized menu entries.
 */
export const getAuthorizedMenu = async (): Promise<NavigationEntry[]> => {
  const currentUser = await getAuthenticatedUser();
  const userRole = currentUser?.role;

  if (!currentUser) {
    return [];
  }

  const authorizedMenu = navigationMenu.filter((item) => {
    if (!item.roles) return true;
    if (item.roles[0] === "*") return true;
    return !!userRole && item.roles.includes(userRole);
  });

  return authorizedMenu;
};
