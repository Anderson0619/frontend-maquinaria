import { ERoutePath } from "routes/routes";

import { IBase } from "./Base.type";
import { IRole } from "./Role.type";
import { IVendor } from "./Vendor.types";

export interface IUser extends IBase {
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  recoveryPasswordToken?: String;
  password?: string;
  networkType?: string;
  roles?: string[];
  vendorList?: IUserVendorListType[];
  selectedVendor?: IVendor;
  random4digits?: number;
  active?: boolean;
  profileImage?: string;
  root?: boolean;
  vendorRoles?: IRole[];
  userRoutes?: ERoutePath[];
  permissions?: string[]
}

export interface IUserRoleVendor {
  role: string;
  vendorId: string;
}

export interface IUserVendorListType {
  id: string;
  name: string;
}
