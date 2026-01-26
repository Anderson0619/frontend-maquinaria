import { createContext, ReactElement } from "react";

export interface IOpenDrawer {
  drawerComponent: JSX.Element;
  onOpenDrawer?: () => void;
  onCloseDrawer?: () => void;
  className?: string;
}

interface IDrawerMethods {
  openDrawer: (params: IOpenDrawer) => void;
  setDrawerComponent: (newDrawerComponent: JSX.Element) => void;
  closeDrawer: () => void;
  isOpen: boolean;
  isOpen2: boolean;
  isOpen3: boolean;
  isOpen4: boolean;
  drawer: ReactElement;
  drawer2: ReactElement;
  drawer3: ReactElement;
  drawer4: ReactElement;
}
const drawerMethods = {
  openDrawer: () => null,
  setDrawerComponent: () => null,
  closeDrawer: () => null,
  isOpen: false,
  isOpen2: false,
  isOpen3: false,
  isOpen4: false,
  drawer: null,
  drawer2: null,
  drawer3: null,
  drawer4: null,
};
export const DrawerContext = createContext<IDrawerMethods>(drawerMethods);
