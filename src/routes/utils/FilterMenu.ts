import { IRoutePath } from "types/Role.type";
import { IUser } from "types/User.types";

export const filterMenuByUser = (
  menu: IRoutePath[],
  user: IUser,
): IRoutePath[] => {
  const filteredRoutes = menu
    .map((route) => {
      if (user?.userRoutes.includes(route.route) || !route.route) {
        if (!route.route) {
          const childrens = route.childrens.filter((child) =>
            user?.userRoutes.includes(child.route),
          );

          if (!childrens.length) {
            return null;
          }
        }

        const composedRoute: IRoutePath = {
          route: route.route,
          icon: route.icon,
          displayName: route.displayName,
          childrens: route.childrens.filter((child) =>
            user?.userRoutes.includes(child.route),
          ),
        };

        return composedRoute;
      }

      return null;
    })
    .filter(Boolean);

  return filteredRoutes;
};
