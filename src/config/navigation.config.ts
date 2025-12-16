import { ROLE_CONSTANTS } from "@/lib/constants/role.constants";
import type { NavigationEntry } from "@/types/navigation-menu.types";

export const navigationMenu: NavigationEntry[] = [
  {
    type: "header",
    title: "admin",
    roles: [ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.TENANT_ADMIN],
  },
  {
    type: "link",
    icon: "CircleGauge",
    path: "/law-firms",
    title: "lawFirms",
    roles: [ROLE_CONSTANTS.SUPER_ADMIN],
  },
  {
    type: "link",
    icon: "Users",
    path: "/users",
    title: "users",
    roles: [ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.TENANT_ADMIN],
    subItems: [
      {
        type: "link",
        icon: "UserPlus",
        path: "/users/new",
        title: "newUser",
        roles: [ROLE_CONSTANTS.SUPER_ADMIN],
        routeOnly: true,
      },
      {
        type: "link",
        icon: "UserPlus",
        path: "/users/[userId]",
        title: "newUser",
        roles: [ROLE_CONSTANTS.SUPER_ADMIN],
        routeOnly: true,
      },
    ],
  },
  {
    type: "link",
    icon: "BookText",
    path: "/admin/definitions",
    title: "definitions",
    roles: [ROLE_CONSTANTS.SUPER_ADMIN],
    subItems: [
      {
        type: "link",
        icon: "LayoutPanelTop",
        path: "/admin/definitions/case-types",
        title: "caseTypes",
      },
      {
        type: "link",
        icon: "LayoutPanelLeft",
        path: "/admin/definitions/contract-types",
        title: "contractTypes",
      },
      {
        type: "link",
        icon: "LayoutPanelTop",
        path: "/definitions/document-types",
        title: "documentTypes",
      },
      {
        type: "link",
        icon: "LayoutPanelLeft",
        path: "/definitions/petition-types",
        title: "petitionTypes",
      },
    ],
  },
  {
    type: "link",
    icon: "Workflow",
    path: "/approval-rules",
    title: "approvalRules",
    roles: [ROLE_CONSTANTS.TENANT_ADMIN],
  },
  {
    type: "header",
    title: "pages",
  },
  {
    type: "link",
    icon: "LayoutDashboard",
    path: "/",
    title: "dashboard",
  },
  {
    type: "link",
    icon: "CalendarDays",
    path: "/activities",
    title: "calendar",
  },
  {
    type: "link",
    icon: "Album",
    path: "/cases",
    title: "cases",
    // badge: 4
  },
  {
    type: "link",
    icon: "BookMarked",
    path: "/clients",
    title: "clients",
  },
  {
    type: "link",
    icon: "HardDrive",
    path: "/reports",
    title: "reports",
    subItems: [
      {
        type: "link",
        icon: "LayoutPanelTop",
        path: "/reports/cases",
        title: "cases",
      },
      {
        type: "link",
        icon: "LayoutPanelLeft",
        path: "/reports/clients",
        title: "clients",
      },
    ],
  },
];
