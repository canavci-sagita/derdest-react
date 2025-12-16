export const COOKIE_CONSTANTS = {
  /**
   * Used to store the user's preference for language.
   * Value is expected to be culture code like 'en'.
   */
  LANGUAGE: "lang",
  /**
   * Used to store JWT token.
   */
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "Refresh-Token",
  /**
   * Used to store the user's preference for a compact sidebar menu.
   * Value is expected to be 'true' or 'false'.
   */
  COMPACT_MENU: "compactMenu",
  /**
   * Used to store the user's preference for a cases view.
   * Value is expected to be 'list' or 'table'.
   */
  CASES_VIEW_MODE: "casesViewMode",
} as const;
