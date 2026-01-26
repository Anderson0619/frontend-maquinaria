import { createContext, Dispatch, useContext } from "react";
import { IVendor } from "types/Vendor.types";

interface IVendorContext {
  vendor: IVendor;
  dispatch: Dispatch<unknown>;
}

const VendorContextMethods = {
  vendor: null,
  dispatch: () => {},
};

export const VendorContext =
  createContext<IVendorContext>(VendorContextMethods);

export const useVendor = () => useContext(VendorContext);
