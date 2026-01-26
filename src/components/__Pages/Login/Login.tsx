import ToggleLang from "components/_Custom/Toggle/ToggleLang/ToggleLang";
import { LoginForm } from "components/__Pages/Login/Forms/Login";
import { useDrawer } from "context/drawer/drawer.provider";
import { useTheme } from "next-themes";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { Col, Row } from "rsuite";
import {
  ILLUSTRATION_LOGIN,
  THEME,
  VERTICAL_LOGO_DARK,
  VERTICAL_LOGO_LIGHT,
} from "settings/constants";
import { RegisterForm } from "./Forms/Register";
import LeftImagePublic from "./LeftImagePublic";

const Login = () => {
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const { openDrawer } = useDrawer();

  const handleRegister = () => {
    openDrawer({
      drawerComponent: <RegisterForm />,
    });
  };

  return (
    <div className="w-full">
      <Row className="m-0">
        <Col xs={24} sm={24} md={12} className="h-2/6 lg:h-screen">
          <div className="hidden md:inline-block h-full">
            <LeftImagePublic
              backgroundImage={ILLUSTRATION_LOGIN}
              label={t("register.slogan")}
            />
          </div>
          <div className="flex flex-col md:hidden text-center align-middle items-center mt-16">
            <Image
              src={
                theme === THEME.dark ? VERTICAL_LOGO_DARK : VERTICAL_LOGO_LIGHT
              }
              width={300}
              height={100}
              alt="logo"
            />
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          className="animate__animated animate__fadeIn flex flex-col items-center justify-center lg:h-screen lg:pt-0"
        >
          <div className="flex flex-col items-start w-5/6 md:w-4/6">
            <div className="w-full hidden md:flex justify-center">
              <Image
                src={
                  theme === THEME.dark
                    ? VERTICAL_LOGO_DARK
                    : VERTICAL_LOGO_LIGHT
                }
                width={300}
                height={100}
                alt="logo"
              />
            </div>
            <div className="mt-8 pb-3 w-full">
              <div className="flex justify-items-center justify-center w-full">
                <LoginForm />
              </div>
              <div className="flex justify-items-center justify-center text-center w-full">
                <p>{t("register.registerText")}</p>
                <a
                  className="ml-1 inline text-blue-400 cursor-pointer"
                  aria-hidden
                  onClick={handleRegister}
                >
                  {t("register.registerTitle")}
                </a>
              </div>
              <div className="flex flex-row items-center justify-center mt-3 w-full">
                <ToggleLang />
              </div>
              <div className="text-center align-middle">
                <p className="mt-5 text-xs text-gray-300">
                  {t("login.copyright")}
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
