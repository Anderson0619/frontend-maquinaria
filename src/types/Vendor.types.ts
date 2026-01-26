import { IBase } from "./Base.type";

export enum EColorType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export interface IColor {
  color: string;
  type: EColorType;
}

export interface IVendorBanner {
  title?: string;
  description?: string;
  bannerUrl?: string;
  cta?: string;
  btnColor?: string;
  btnText?: string;
  align?: string;
  modal?: string;
}

export interface IAddress {
  address?: string;
  lat?: number;
  lng?: number;
}

export enum EVendorStatus {
  ACTIVE = "ACTIVE",
  MAINTENANCE = "MAINTENANCE",
  DOWN = "DOWN",
}

export interface IVendor extends IBase {
  slug: string;
  name: string;
  phone?: string;
  email?: string;
  logo?: string;
  banners?: IVendorBanner[];
  status?: EVendorStatus;
  description?: string;
  thumbnail?: string;
  colors?: IColor[];
  domains?: string[];
  url?: string;
  address?: IAddress;
}
