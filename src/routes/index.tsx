import { useProfile } from "context/profile/profile.context";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import PrivateRoute from "routes/utils/PrivateRoute";
import { IRoute, PRIVATE_ROUTES, PUBLIC_ROUTES } from "./routes";
import { RouteLayout } from "./types";

type IRoutes = {
  PRIVATE: {
    [route in keyof typeof PRIVATE_ROUTES]: IRoute;
  };
  PUBLIC: {
    [route in keyof typeof PUBLIC_ROUTES]: IRoute;
  };
};

export const ROUTES: IRoutes = {
  PRIVATE: PRIVATE_ROUTES,
  PUBLIC: PUBLIC_ROUTES,
};

const Routes = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { user } = useProfile();

  const getCurrentRoute = (
    routes: IRoutes["PRIVATE"] | IRoutes["PUBLIC"],
    isPrivate = false,
  ) => {
    let currentRoute: IRoute;
    let isPrivatePath = false;

    Object.values(routes).some((route) => {
      const isRoute = route.path.includes(router.pathname);
      if (isRoute) {
        isPrivatePath = isPrivate;
        currentRoute = route;
      }
      return isRoute;
    });

    return { currentRoute, isPrivatePath };
  };

  let route: IRoute;

  // * search for the current route in private routes
  const { currentRoute, isPrivatePath } = getCurrentRoute(ROUTES.PRIVATE, true);
  route = currentRoute;

  // * if route was not private, search for the current route in public routes
  if (!isPrivatePath) {
    route = getCurrentRoute(ROUTES.PUBLIC).currentRoute;
  }

  // * we check the user routes calculated in the backend
  if (user && isPrivatePath && !user?.userRoutes.includes(route?.name)) {
    router.replace("/404");
    return null;
  }

  return (
    <>
      {isPrivatePath ? (
        <PrivateRoute>
          <RouteLayout layout={route?.layout}>
            <Component {...pageProps} />
          </RouteLayout>
        </PrivateRoute>
      ) : (
        <RouteLayout layout={route?.layout}>
          <Component {...pageProps} />
        </RouteLayout>
      )}
    </>
  );
};

export default Routes;
