import { ELayout } from "settings/constants";

export enum ERoutePath {
  COMPONENTS = "COMPONENTS",
  PROFILE = "PROFILE",
  SITE_CONFIG = "SITE_CONFIG",
  NOTFOUND = "NOTFOUND",
  LOGIN = "LOGIN",
  ROLES = "ROLES",
  USERS = "USERS",
  RESET = "RESET",
  VENDORS = "VENDORS",
  MAQUINARIA = "MAQUINARIA",
  UBICACION = "UBICACION",
  MOVIMIENTO = "MOVIMIENTO",
  DASHBOARD = "DASHBOARD",
}

export interface IRoute {
  path: string;
  icon?: string;
  layout?: ELayout;
  name: ERoutePath;
}

export const PRIVATE_ROUTES = {
  [ERoutePath.COMPONENTS]: {
    path: "/app/components",
    icon: "components",
    layout: ELayout.MANAGER,
    name: ERoutePath.COMPONENTS,
  },
  [ERoutePath.PROFILE]: {
    path: "/app/profile",
    icon: "profile",
    layout: ELayout.MANAGER,
    name: ERoutePath.PROFILE,
  },
  [ERoutePath.SITE_CONFIG]: {
    path: "/app/config/site-config",
    icon: "config",
    layout: ELayout.MANAGER,
    name: ERoutePath.SITE_CONFIG,
  },
  [ERoutePath.ROLES]: {
    path: "/app/config/roles",
    icon: "roles",
    layout: ELayout.MANAGER,
    name: ERoutePath.ROLES,
  },
  [ERoutePath.USERS]: {
    path: "/app/home/users",
    icon: "users",
    layout: ELayout.MANAGER,
    name: ERoutePath.USERS,
  },
  [ERoutePath.MAQUINARIA]: {
    path: "/app/maquinaria",
    icon: "maquinaria",
    layout: ELayout.MANAGER,
    name: ERoutePath.MAQUINARIA,
  },
  [ERoutePath.UBICACION]: {
    path: "/app/ubicacion",
    icon: "ubicacion",
    layout: ELayout.MANAGER,
    name: ERoutePath.UBICACION,
  },
  [ERoutePath.MOVIMIENTO]: {
    path: "/app/movimiento",
    icon: "config",
    layout: ELayout.MANAGER,
    name: ERoutePath.MOVIMIENTO,
  },
  [ERoutePath.DASHBOARD]: {
    path: "/app/dashboard",
    icon: "dashboard",
    layout: ELayout.MANAGER,
    name: ERoutePath.DASHBOARD,
  }
};

export const PUBLIC_ROUTES = {
  [ERoutePath.VENDORS]: {
    path: "/app/config/vendors",
    icon: "vendors",
    layout: ELayout.MANAGER,
    name: ERoutePath.VENDORS,
  },
  [ERoutePath.NOTFOUND]: {
    path: "/404",
    icon: "404",
    layout: ELayout.CLEAN,
    name: ERoutePath.NOTFOUND,
  },
  [ERoutePath.LOGIN]: {
    path: "/login",
    icon: "login",
    layout: ELayout.CLEAN,
    name: ERoutePath.LOGIN,
  },
  [ERoutePath.RESET]: {
    path: "/recover",
    icon: "recover",
    layout: ELayout.CLEAN,
    name: ERoutePath.RESET,
  },
};

export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...PRIVATE_ROUTES,
};
