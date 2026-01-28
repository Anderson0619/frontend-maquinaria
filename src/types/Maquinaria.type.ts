import { IBase } from "./Base.type";
import { IUser } from "./User.types";

export interface IMaquinaria extends IBase {
    maquiNumber?: string;
    type?: string;
    mark?: string;
    model?: string;
    anio?: string;
    description?: string;
    estado?: string;
    location?: string;
    detalle?: string;
    logo?: null | { url: string};
    user: IUser;
}