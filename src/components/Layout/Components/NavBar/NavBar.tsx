import Avatar from "boring-avatars";
import Icon from "components/_Custom/Icon/Icon";
import ToggleLang from "components/_Custom/Toggle/ToggleLang/ToggleLang";
import ToggleTheme from "components/_Custom/Toggle/ToggleTheme/ToggleTheme";
import ToggleVendor from "components/_Custom/Toggle/ToggleVendor/ToggleVendor";
import { useAuth } from "context/auth";
import { useProfile } from "context/profile/profile.context";
import { useTheme } from "next-themes";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { ERoutePath, PRIVATE_ROUTES } from "routes/routes";
import { Button, ButtonToolbar, Dropdown } from "rsuite";
import {
  AVATAR_COLORS,
  DEFAULT_AVATAR,
  LOGO_DARK,
  LOGO_LIGHT,
  WIDTH_MD,
} from "settings/constants";
import useWindowSize from "utils/hooks/useWindowSize";
import {
  AvatarContainer,
  AvatarImage,
  UserInfoContainer,
} from "./NavBar.style";

interface NavbarProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
}

const Navbar = (props: NavbarProps) => {
  const { t } = useTranslation("common");
  const { signout } = useAuth();
  const { user } = useProfile();
  const wSize = useWindowSize();
  const { theme } = useTheme();
  const { showSideBar, setShowSideBar } = props;
  const router = useRouter();
  const handleRedirect = (url: string) => {
    router.push({ pathname: url });
    setShowSideBar(false);
  };

  const handleClick = () => {
    setShowSideBar(!showSideBar);
  };

  const UserAvatar = () => (
    <AvatarContainer>
      <UserInfoContainer>
        <Dropdown
          placement="bottomEnd"
          renderToggle={(props, ref) => (
            <div className="flex items-center" {...props} ref={ref}>
              {user?.profileImage === DEFAULT_AVATAR || !user?.profileImage ? (
                <Avatar
                  size={30}
                  name={`${user?.name} ${user?.lastname}`}
                  variant="beam"
                  colors={AVATAR_COLORS}
                />
              ) : (
                <AvatarImage
                  className="bg-gray-900 dark:bg-white border"
                  style={{
                    backgroundImage: `url(${user?.profileImage})`,
                    width: 30,
                    height: 30,
                  }}
                />
              )}
              {wSize?.width >= WIDTH_MD && (
                <div className="text-base ml-2">
                  {user?.name || user?.lastname}
                </div>
              )}
            </div>
          )}
        >
          <Dropdown.Item
            onClick={() =>
              handleRedirect(PRIVATE_ROUTES[ERoutePath.PROFILE].path)
            }
          >
            <Icon icon="user" className="mr-2" />
            <span className="text-500">{t("profile.profileTitle")}</span>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => signout()}>
            <Icon icon="sign-out-alt" className="text-500 mr-2" />
            <span className="text-red-500">{t("profile.logOut")}</span>
          </Dropdown.Item>
        </Dropdown>
      </UserInfoContainer>
    </AvatarContainer>
  );

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap  p-3 bg-white dark:bg-black shadow-sm">
        <div className="flex justify-between w-full md:w-auto">
          <div className="md:hidden">
            <Button appearance="subtle" onClick={handleClick}>
              <Icon icon="bars" style={{ fontSize: 20 }} />
            </Button>
          </div>
          <div className="lg:hidden">
            <Image
              src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
              width={140}
              height={50}
              alt="logo"
            />
          </div>
          {wSize?.width < WIDTH_MD && <UserAvatar />}
        </div>
        <ButtonToolbar className="flex space items-center md:justify-around gap-1 justify-center w-full md:w-auto">
          <ToggleVendor />
          <ToggleTheme />
          <ToggleLang />
          {wSize?.width >= WIDTH_MD && <UserAvatar />}
        </ButtonToolbar>
      </nav>
    </>
  );
};

export default Navbar;
