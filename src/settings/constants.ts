export const DEFAULT_INITIAL_ROUTE = "/login";
export const LOGIN_REDIRECT_ROUTE = "/app/components";

export const DEFAULT_PROFILE_IMAGE = "some-default-url-avatar-for-users";
export const ICON = "/images/png/logo.png";

export const LOGO_DARK = "/images/png/logo.png";
export const LOGO_LIGHT = "/images/png/logo.png";

export const LOGO_FDARK = "/images/svg/logo/dark/HorizontalLogo.svg";
export const LOGO_FLIGHT = "/images/svg/logo/light/HorizontalLogo.svg";

export const VERTICAL_LOGO_DARK = "/images/png/logo.png";
export const VERTICAL_LOGO_LIGHT = "/images/png/logo.png";

export const VERTICAL_FLOGO_DARK = "/images/svg/logo/dark/VerticalLogo.svg";
export const VERTICAL_FLOGO_LIGHT = "/images/svg/logo/light/VerticalLogo.svg";

export const SITE_LOADER_DARK = "utils/lottie/site-loader.json";
export const SITE_LOADER_LIGHT = "utils/lottie/site-loader.json";

export const USER_TOKEN_PERSIST =
  "x1QTUA0Pe8Sat2AGdsZ31f8HYOxYlR90Wfk0yDcX17pSt";
export const VENDOR_ID_PERSIST =
  "x1QTUA0Pe8Sat2AGdsZ31f8HYOxYlR90Wfk0yDcX17pSy";
export const USER_ID_PERSIST = "x1QTUA0Pe8Sat2AGdsZ31f8HYOxYlR90Wfk0yDcX17pSi";
export const REFRESH_TOKEN_PERSIST =
  "x1QTUA0Pe8Sat2AGdsZ31f8HYOxYlR90Wfk0yDcX17pSe";

export const USER_LAST_LOCATION =
  "x1QTUA0Pe8Sat2AGdsZ31f8HYOxYlR90Wfk0yDcX17plt";

export const MOBILE_VIEW = 1024;
export const SIDEBAR_WIDTH = 300;

export const AFTER_LOGIN_REDIRECT = "/app/profile";
export const PUBLIC_HOME = "/app/home";

export const DEFAULT_THEME = process.env.NEXT_PUBLIC_DEFAULT_THEME || "dark";

export enum ELayout {
  "MANAGER" = "MANAGER",
  "LANDING" = "LANDING",
  "CLEAN" = "CLEAN",
}

export enum GraphQLErrors {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  BAD_USER_INPUT = "BAD_USER_INPUT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  GRAPHQL_VALIDATION_FAILED = "GRAPHQL_VALIDATION_FAILED",
  GRAPHQL_PARSE_FAILED = "GRAPHQL_PARSE_FAILED",
}
export const USER_LANG = "x1QTUA0Pe8Sat2AGdsZ31f8HYOxYlR90Wfk0yDcX17gGg";
export const isBrowser = typeof window !== "undefined";

export const WIDTH_SM = 640;
export const WIDTH_MD = 768;
export const WIDTH_LG = 1024;
export const WIDTH_XL = 1280;
export const WIDTH_2XL = 1536;
export const WIDTH_3XL = 1920;
export const WIDTH_4XL = 2560;
export const WIDTH_5XL = 3840;
export const WIDTH_6XL = 5120;

export const AVATAR_COLORS = [
  "#92A1C6",
  "#146A7C",
  "#F0AB3D",
  "#C271B4",
  "#C20D90",
];

export const THEME = {
  light: "light",
  dark: "dark",
};

export const DEFAULT_SITE_VENDOR_ID = "8cc061b9-9ec1-4077-ad1d-34e4905100a2";

export const DEFAULT_AVATAR = "some-default-url-avatar-for-users";

// * regex
export const NUMBER_SPACES_AND_LETTER_REGEX =
  /^[A-Za-z0-9\u00C0-\u017F.\-\s]+$/;
export const ONLY_WORDS_SPACES_DASH_DOT_REGEX = /^[A-Za-z\u00C0-\u017F.\-\s]+$/;
export const ONLY_WORDS_AND_SPACES_REGEX = /^[A-zÀ-ú\s]*$/;
export const NAME_VALIDATION_REGEX =
  /^[A-zÀ-ú]+[[A-zÀ-ú0-9 ]*[A-zÀ-ú0-9][A-zÀ-ú0-9 ]*/;

export const ANY_CHARACTER_REGEX = /^[A-zÀ-ú\s]*$/;

export const VALID_URL_REGEX =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;

export const ILLUSTRATION_LOGIN = "/images/png/login.jpg";

export const DEFAULT_USER_COVER =
  "/images/svg/illustrations/banner-profile.svg";

export const GOOGLE_MAP_API_KEY = "AIzaSyDcQ1AvRTdklc85mYBHiXVZIdITpLd-pgk";

export const ALLOWED_THUMBNAIL_EXTENSIONS = ".png,.jpg,.jpeg,.gif";
