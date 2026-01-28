import { IBase } from "./Base.type";
import { IUser } from "./User.types";

export interface IMovimiento extends IBase {
  movimientoNumber: string;
  maquinaria?: string[];
  solicitante?: string;
  autoriza?: string;
  traslado?: string[];
  origen?: string[];
  fechaS?: string;
  fechaT?: string;
  movimiento?: string;
  logo?: null | { url: string};
  user: IUser;
}