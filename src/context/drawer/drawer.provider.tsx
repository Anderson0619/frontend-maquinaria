import { FC, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { DrawerContext, IOpenDrawer } from "./drawer.context";

interface IDrawerProvider {}

const DrawerProvider: FC<IDrawerProvider> = (props) => {
  const { children } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  const [isOpen3, setIsOpen3] = useState<boolean>(false);
  const [isOpen4, setIsOpen4] = useState<boolean>(false);

  const [drawer, setDrawer] = useState<JSX.Element | null>();
  const [drawer2, setDrawer2] = useState<JSX.Element | null>();
  const [drawer3, setDrawer3] = useState<JSX.Element | null>();
  const [drawer4, setDrawer4] = useState<JSX.Element | null>();
  const closeDrawer = () => {
    if (isOpen4) {
      setIsOpen4(false);
      setDrawer4(null);
    } else if (isOpen3) {
      setIsOpen3(false);
      setDrawer3(null);
    } else if (isOpen2) {
      setIsOpen2(false);
      setDrawer2(null);
    } else {
      setIsOpen(false);
      setDrawer(null);
    }
  };

  const setDrawerComponent = (newDrawerComponent: JSX.Element) => {
    setDrawer(newDrawerComponent);
  };

  const value = useMemo(
    () => ({
      openDrawer: (params: IOpenDrawer) => {
        const { drawerComponent } = params;

        if (!isOpen) {
          setDrawer(drawerComponent);
          setIsOpen(true);
        } else if (isOpen && !isOpen2) {
          setDrawer2(drawerComponent);
          setIsOpen2(true);
        } else if (isOpen2 && !isOpen3) {
          setDrawer3(drawerComponent);

          setIsOpen3(true);
        } else if (isOpen3 && !isOpen4) {
          setDrawer4(drawerComponent);

          setIsOpen4(true);
        } else {
          toast.error("You can only open 4 drawers at a time");
        }
      },
      setDrawerComponent,
      isOpen,
      isOpen2,
      isOpen3,
      isOpen4,
      closeDrawer,
      drawer,
      drawer2,
      drawer3,
      drawer4,
    }),
    [isOpen, isOpen2, isOpen3, isOpen4],
  );

  return (
    <DrawerContext.Provider {...{ value }}>{children}</DrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(DrawerContext);

export default DrawerProvider;
