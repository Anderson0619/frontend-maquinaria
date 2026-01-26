import CleanLayout from "components/Layout/CleanLayout";
import LandingLayout from "components/Layout/LandingLayout";
import ManagerLayout from "components/Layout/ManagerLayout";
import { FC } from "react";
import { ELayout } from "settings/constants";

interface IRouteLayout {
  layout: ELayout;
}

const LAYOUTS = {
  [ELayout.CLEAN]: CleanLayout,
  [ELayout.MANAGER]: ManagerLayout,
  [ELayout.LANDING]: LandingLayout,
};

export const RouteLayout: FC<IRouteLayout> = (props) => {
  const { children } = props;
  const { layout = ELayout.CLEAN } = props;
  const Layout = LAYOUTS[layout];

  return <Layout>{children}</Layout>;
};
