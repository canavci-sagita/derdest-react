import type { DropdownMenuEntry } from "@/types/dropdown-menu.types";

export const userDropdownMenu: DropdownMenuEntry[] = [
  { type: "item", icon: "ToggleLeft", key: "switch", label: "switchAccount" },
  { type: "divider" },
  {
    type: "item",
    icon: "Settings",
    key: "settings",
    label: "settings",
  },
  {
    type: "item",
    icon: "Lock",
    key: "reset",
    label: "changePassword",
  },
  { type: "divider" },
  { type: "item", icon: "Power", key: "signOut", label: "signOut" },
];
