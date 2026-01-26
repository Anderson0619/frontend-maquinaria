import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidePane from "components/_Custom/SidePane";
import { Button } from "rsuite";
import { WIDTH_SM } from "settings/constants";
import useWindowSize from "utils/hooks/useWindowSize";
import { useDrawer } from "./drawer.provider";

const DrawerComponent = () => {
  const {
    isOpen,
    isOpen2,
    isOpen3,
    isOpen4,
    closeDrawer,
    drawer,
    drawer2,
    drawer3,
    drawer4,
  } = useDrawer();
  const wsize = useWindowSize();
  const width = wsize.width <= WIDTH_SM ? 100 : 99.9;

  return (
    <SidePane
      open={isOpen}
      onClose={closeDrawer}
      duration={250}
      width={width}
      backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5" }}
    >
      {({ onActive }) => (
        <>
          <div className="fixed z-50 right-2 top-2">
            <Button appearance="subtle" onClick={closeDrawer}>
              <FontAwesomeIcon icon="times-circle" size="2x" />
            </Button>
          </div>
          <div className="w-full h-full p-2 md:p-6 pt-12 overflow-auto bg-green-50 dark:bg-green-900">
            {drawer}
            <SidePane
              onActive={onActive}
              open={isOpen2}
              onClose={closeDrawer}
              duration={250}
              offset={5}
              width={width}
              backdropClassName="z-7"
            >
              {({ onActive: onActive2 }) => (
                <>
                  <div className="fixed z-50 right-2 top-2">
                    <Button appearance="subtle" onClick={closeDrawer}>
                      <FontAwesomeIcon icon="times-circle" size="2x" />
                    </Button>
                  </div>
                  <div className="w-full h-full p-2 md:p-6 pt-12 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {drawer2}
                    <SidePane
                      onActive={onActive2}
                      open={isOpen3}
                      onClose={closeDrawer}
                      duration={250}
                      offset={5}
                      width={width}
                    >
                      {({ onActive: onActive3 }) => (
                        <>
                          <div className="fixed z-50 right-2 top-2">
                            <Button appearance="subtle" onClick={closeDrawer}>
                              <FontAwesomeIcon icon="times-circle" size="2x" />
                            </Button>
                          </div>
                          <div className="w-full h-full p-2 md:p-6 pt-12 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            {drawer3}
                            <SidePane
                              onActive={onActive3}
                              open={isOpen4}
                              onClose={closeDrawer}
                              duration={250}
                              offset={5}
                              width={width}
                            >
                              <div>
                                <div className="fixed z-50 right-2 top-2">
                                  <Button
                                    appearance="subtle"
                                    onClick={closeDrawer}
                                  >
                                    <FontAwesomeIcon
                                      icon="times-circle"
                                      size="2x"
                                    />
                                  </Button>
                                </div>
                                <div className="w-full h-full p-2 md:p-6 pt-12 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                                  {drawer4}
                                </div>
                              </div>
                            </SidePane>
                          </div>
                        </>
                      )}
                    </SidePane>
                  </div>
                </>
              )}
            </SidePane>
          </div>
        </>
      )}
    </SidePane>
  );
};

export default DrawerComponent;
