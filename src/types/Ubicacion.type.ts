import { IBase } from "./Base.type";
import { IUser } from "./User.types";

export interface IUbicacion extends IBase {
    ubiNumber?: string;
    type?: string;
    ubicacion?: string;
    provincia?: string;
    canton?: string;
    encargado?: string;
    description?: string;
    logo?: null | { url: string};
    user: IUser;
}