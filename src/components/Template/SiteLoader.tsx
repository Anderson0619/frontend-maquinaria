import { AuthContext } from "context/auth";
import { useProfile } from "context/profile/profile.context";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
//import Lottie from "react-lottie";
import dynamic from 'next/dynamic';
import { ERoutePath, PUBLIC_ROUTES } from "routes/routes";
import { LOGIN_REDIRECT_ROUTE } from "settings/constants";
import lottieSiteLoaderDark from "utils/lottie/site-loader-dark.json";
import lottieSiteLoaderLight from "utils/lottie/site-loader-light.json";

const loaderLightLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieSiteLoaderLight,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Lottie = dynamic(() => import('react-lottie'), {
  ssr: false,
});

const loaderDarkLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieSiteLoaderDark,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SiteLoader = ({ children }) => {
  const { theme } = useTheme();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  const { user } = useProfile();

  const isPublicRoute = useCallback(
    () =>
      Object.values(PUBLIC_ROUTES)
        .map((route) => route.path)
        .includes(router.pathname),
    [router.pathname],
  );

  useEffect(() => {
    if (isAuthenticated() && user) {
      if (router.pathname === "/" || router.pathname === "/login") {
        if (router.query?.redirect) {
          const rawQuery = { ...router.query };
          delete rawQuery.redirect;

          router
            .push({
              pathname: router.query.redirect as string,
              query: rawQuery,
            })
            .then(() => setShowLoader(false));
        } else {
          router.push(LOGIN_REDIRECT_ROUTE).then(() => setShowLoader(false));
        }
      } else {
        setShowLoader(false);
      }
    } else if (!isAuthenticated()) {
      if (!isPublicRoute()) {
        router
          .push({
            pathname: PUBLIC_ROUTES[ERoutePath.LOGIN].path,
            query: {
              redirect: router.asPath,
            },
          })
          .then(() => setShowLoader(false));
      } else {
        setShowLoader(false);
      }
    }
    // * we set the showLoader to false on unmount
    return () => {
      setShowLoader(false);
    };
  }, [user]);

  if (showLoader)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Lottie
          options={
            theme === "light"
              ? loaderDarkLottieOptions
              : loaderLightLottieOptions
          }
          height={80}
          width={80}
        />
      </div>
    );

  return <>{children}</>;
};

export default SiteLoader;
