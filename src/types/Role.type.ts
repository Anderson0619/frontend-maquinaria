import { ERoutePath } from "routes/routes";
import { IBase } from "./Base.type";

export interface IRoutePath {
  route?: ERoutePath;
  childrens?: IRoutePath[];
  displayName?: string;
  icon?: string;
  root?: boolean;
}

export interface IRole extends IBase {
  name: string;
  vendor: string;
  routes: ERoutePath[];
  deletable?: boolean;
  editable?: boolean;
  permissions?: string[]
}
