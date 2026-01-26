import { ELayout } from "settings/constants";

import CleanLayout from "../CleanLayout";
import LandingLayout from "../LandingLayout";
import ManagerLayout from "../ManagerLayout";

// * register layouts here
export const LAYOUTS = {
  [ELayout.CLEAN]: CleanLayout,
  [ELayout.MANAGER]: ManagerLayout,
  [ELayout.LANDING]: LandingLayout,
};
