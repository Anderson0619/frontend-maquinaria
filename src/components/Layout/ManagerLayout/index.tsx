import { FC, useEffect, useState } from "react";
import { ProSidebar } from "react-pro-sidebar";
import { WIDTH_MD } from "settings/constants";
import useWindowSize from "utils/hooks/useWindowSize";
import NavBar from "../Components/NavBar/NavBar";
import ManagerLayoutContent from "./ManagerLayoutContent";

const ManagerProLayout: FC = (props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    !!+localStorage.getItem("isCollapsed") || false,
  );
  const { children } = props;
  const [showSideBar, setShowSideBar] = useState<boolean>(
    !!+localStorage.getItem("showSideBar") || false,
  );
  const [showRightSideBar, setShowRightSideBar] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed ? "1" : "0");
    localStorage.setItem("showSideBar", showSideBar ? "1" : "0");
  }, [isCollapsed, showSideBar]);

  const wwidth = useWindowSize()?.width;
  const isMd = wwidth >= WIDTH_MD;

  return (
    <div className="flex h-full max-w-full max-w-screen w-screen">
      <ProSidebar
        collapsed={isMd ? isCollapsed : false}
        toggled={isMd ? false : showSideBar}
        breakPoint="md"
        onToggle={() => setShowSideBar(false)}
      >
        <ManagerLayoutContent
          {...{
            showSideBar,
            setShowSideBar,
            isCollapsed,
            setIsCollapsed,
            isMd,
          }}
        />
      </ProSidebar>
      <div className="flex-1 h-full overflow-y-none flex flex-col min-w-0">
        <NavBar
          {...{
            showSideBar,
            setShowSideBar,
            showRightSideBar,
            setShowRightSideBar,
          }}
        />
        <div className="p-3 md:p-6 bg-white dark:bg-black flex-1 overflow-y-auto container mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ManagerProLayout;
