import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "animate.css/animate.css";
import SiteHead from "components/Template/SiteHead";
import SiteLoader from "components/Template/SiteLoader";
import Tailwind from "components/Template/Tailwind/Tailwind";
import Theme from "components/Template/Theme/Theme";
import DrawerComponent from "context/drawer/drawer.component";
import DrawerProvider from "context/drawer/drawer.provider";
import ModalProvider from "context/modal/modal.provider";
import { ProfileProvider } from "context/profile/profile.provider";
import { VendorProvider } from "context/vendor/vendor.provider";
import { gqlVendor } from "gql";
import { ThemeProvider } from "next-themes";
import App, { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { animateScroll as scroll } from "react-scroll";
import Routes from "routes";
import "rsuite/dist/rsuite.min.css";
import { GOOGLE_MAP_API_KEY, isBrowser, THEME } from "settings/constants";
import "styles/global.scss";
import "styles/overwrite-rsuite.scss";
import "styles/react-pro-sidebar.scss";
import "styles/side-pane.scss";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { EColorType, IVendor } from "types/Vendor.types";
import { generateSitePalette } from "utils/siteColors";
import AuthProvider from "../context/auth";
import { default as client } from "../settings/apollo";

SwiperCore.use([Navigation, Pagination, Autoplay]);

interface ICustomAppProps extends AppProps {
  vendor: IVendor;
}

function MyApp(props: ICustomAppProps) {
  const theme = isBrowser ? localStorage.getItem("theme") : "dark";

  const { vendor } = props;
  const router = useRouter();

  router?.events?.on("routeChangeComplete", () => {
    scroll?.scrollToTop({ containerId: "layoutMainContent" });
  });

  useEffect(() => {
    if (isBrowser) {
      const primaryColor = vendor?.colors.find(
        (color) => color.type === EColorType.PRIMARY,
      );
      generateSitePalette(primaryColor?.color || "red");
    }
  }, []);

  return (
    <>
      <Head>
        <title>{vendor?.name}</title>
        <meta name="title" content={vendor?.name} />
        <meta name="description" content={vendor?.description} />
        <meta name="url" content={vendor?.url} />
        <meta name="image" content={vendor?.thumbnail} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={vendor?.url} />
        <meta property="og:title" content={vendor?.name} />
        <meta property="og:description" content={vendor?.description} />
        <meta property="og:image" content={vendor?.thumbnail} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="650" />
        <meta property="twitter:image" content={vendor?.thumbnail} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={vendor?.url} />
        <meta property="twitter:title" content={vendor?.name} />
        <meta property="twitter:description" content={vendor?.description} />
        <link rel="image_src" href={vendor?.thumbnail} />
        <script
          type="text/javascript"
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`}
        />
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider attribute="class" defaultTheme={theme}>
          <Theme>
            <SiteHead />
            <Tailwind />
            <VendorProvider vendor={vendor}>
              <ProfileProvider>
                <DrawerProvider>
                  <AuthProvider>
                    <SiteLoader>
                      <ModalProvider>
                        {isBrowser && <DrawerComponent />}
                        <Toaster
                          position="top-center"
                          reverseOrder={false}
                          gutter={8}
                          containerClassName=""
                          containerStyle={{}}
                          toastOptions={{
                            style:
                              theme === THEME.dark
                                ? {
                                    borderRadius: "10px",
                                    background: "#333",
                                    color: "#fff",
                                  }
                                : {},
                          }}
                        />
                        <Routes {...props} />
                      </ModalProvider>
                    </SiteLoader>
                  </AuthProvider>
                </DrawerProvider>
              </ProfileProvider>
            </VendorProvider>
          </Theme>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;

  const apolloClient = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_APP_API_URL}/graphql`,
    cache: new InMemoryCache(),
  });

  let vendor = null;

  try {
    const { data } = await apolloClient.query<{ vendor: IVendor }>({
      query: gqlVendor.queries.GET_VENDOR,
      context: {
        headers: {
          hostname: isBrowser ? window.location.host : ctx?.req?.headers.host,
        },
      },
    });
    vendor = data.vendor;
  } catch (e) {
    console.error("🤔 error:", JSON.stringify(e));
  }
  
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, vendor };
};

export default MyApp;
