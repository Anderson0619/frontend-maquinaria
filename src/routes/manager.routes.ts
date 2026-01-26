import { IRoutePath } from "types/Role.type";
import { ERoutePath } from "./routes";

export const MAIN_MENU_LISTS: IRoutePath[] = [
  {
    icon: "home",
    displayName: "Home",
    childrens: [
      {
        route: ERoutePath.COMPONENTS,
        childrens: [],
        displayName: "Components",
      },
      {
        displayName: "Users",
        icon: "users",
        route: ERoutePath.USERS,
      },
    ],
  },
  
  { route: ERoutePath.PROFILE, childrens: [], displayName: "Profile" },
  { route: ERoutePath.MAQUINARIA, childrens: [], displayName: "Maquinaria" },
  { route: ERoutePath.UBICACION, childrens: [], displayName: "Ubicación" },
  {
    displayName: "Config",
    icon: "site_config",
    childrens: [
      { route: ERoutePath.SITE_CONFIG, childrens: [], displayName: "Config" },
      { route: ERoutePath.ROLES, childrens: [], displayName: "Roles" },
      {
        route: ERoutePath.VENDORS,
        childrens: [],
        displayName: "Vendor",
      },
    ],
  },
];
