import Icon from "components/_Custom/Icon/Icon";
import { useProfile } from "context/profile/profile.context";
import moment from "moment";
import { useTheme } from "next-themes";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Menu,   
  MenuItem,
  SidebarFooter,
  SidebarHeader,  
  SubMenu,
} from "react-pro-sidebar";
import { MAIN_MENU_LISTS } from "routes/manager.routes";
import { ALL_ROUTES, ERoutePath } from "routes/routes";
import { filterMenuByUser } from "routes/utils/FilterMenu";
import { Button, Tooltip, Whisper } from "rsuite";
import { ICON,LOGO_DARK, LOGO_LIGHT, WIDTH_MD } from "settings/constants";
import useWindowSize from "utils/hooks/useWindowSize";

interface ISideBar {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  forceShowToggleButton?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
  isMd?: boolean;
}
const ManagerLayoutContent = (props: ISideBar) => {
  const { user } = useProfile();
  const { t } = useTranslation("menu");

  const router = useRouter();
  const {
    showSideBar,
    setShowSideBar,
    forceShowToggleButton,
    isCollapsed,
    setIsCollapsed,
    isMd,
  } = props;

  const { theme } = useTheme();
  const wwidth = useWindowSize()?.width;

  const handleRedirect = (url: string) => {
    router.push({ pathname: url });
    if (setShowSideBar) {
      setShowSideBar(false);
    }
  };

  const filteredRoutes = filterMenuByUser(MAIN_MENU_LISTS, user);

  return (
    <>
      <SidebarHeader
        className={`py-6 px-3 flex  items-center ${
          isCollapsed && isMd
            ? "flex-col justify-center gap-2"
            : "justify-between"
        }`}
      >
        {(!isCollapsed || !isMd) && (
           <Image
           className="cursor-pointer"
           src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
           width={200}
           height={80}
           onClick={() => handleRedirect(ALL_ROUTES[ERoutePath.PROFILE].path)}
           alt="logo"
         />
        )}
        {/* <Image
            className="cursor-pointer"
            src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
            width={155}
            height={30}
            onClick={() => handleRedirect(ALL_ROUTES[ERoutePath.PROFILE].path)}
            alt="logo"
          /> */}

        {isCollapsed && isMd && (
          <Image
            className="cursor-pointer"
            src={ICON}
            width={40}
            height={40}
            onClick={() => handleRedirect(ALL_ROUTES[ERoutePath.PROFILE].path)}
            alt="logo"
          />
        )}
        {isMd && !forceShowToggleButton && (
          <Icon
            icon={isCollapsed ? "chevron-right" : "chevron-left"}
            className="cursor-pointer hover:text-current-500"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}
        {(wwidth <= WIDTH_MD || forceShowToggleButton) && (
          <Button
            className={!forceShowToggleButton ? "block md:hidden" : ""}
            appearance="subtle"
            onClick={() => setShowSideBar(!showSideBar)}
          >
            <Icon icon="bars" style={{ fontSize: 22 }} />
          </Button>
        )}
      </SidebarHeader>
      <Menu iconShape="circle" className="flex-1">
        {filteredRoutes.map((item) => {
          const route = ALL_ROUTES[item.route];

          if (!item.childrens.length) {
            return (
              <Whisper
                trigger="hover"
                placement="right"
                key={item.route}
                speaker={
                  isCollapsed && isMd ? (
                    <Tooltip>{t(item.displayName)}</Tooltip>
                  ) : (
                    <div />
                  )
                }
              >
                <MenuItem
                  key={`item ${route.name}`}
                  active={router.pathname === route.path}
                  icon={
                    <Image
                      src={`/images/svg/menu/${item.icon || route.icon}.svg`}
                      width={25}
                      height={25}
                      alt="menu-item"
                    />
                  }
                  onClick={() => {
                    handleRedirect(route.path);
                  }}
                >
                  {t(item.displayName)}
                </MenuItem>
              </Whisper>
            );
          }
          if (item.childrens.length) {
            return (
              <SubMenu
                key={`dropdown ${item.route}`}
                icon={
                  <Image
                    src={`/images/svg/menu/${item.icon || route.icon}.svg`}
                    width={25}
                    height={25}
                    alt="menu-item"
                  />
                }
                title={t(item.displayName)}
              >
                {item.childrens.map((subItem) => {
                  const subRoute = ALL_ROUTES[subItem.route];

                  return (
                    <MenuItem
                      key={subRoute.path}
                      active={router.pathname === subRoute.path}
                      icon={
                        <Image
                          src={`/images/svg/menu/${
                            subItem.icon || subRoute.icon
                          }.svg`}
                          width={25}
                          height={25}
                          alt="menu-item"
                        />
                      }
                      onClick={() => {
                        handleRedirect(subRoute.path);
                      }}
                    >
                      {subItem.displayName}
                    </MenuItem>
                  );
                })}
              </SubMenu>
            );
          }
          return false;
        })}
      </Menu>
      {isMd && !isCollapsed && (
        <SidebarFooter>
          <div className="flex p-6 items-center justify-center">
            Maquinarias ® {moment().format("YYYY")}
          </div>
        </SidebarFooter>
      )}
    </>
  );
};

export default ManagerLayoutContent;
