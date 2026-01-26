import React, { useEffect, useReducer } from "react";
import { IVendor } from "types/Vendor.types";

import { VendorContext } from "./vendor.context";

type Action = { type: "SET_VENDOR_DATA"; payload: any };

function reducer(state: any, action: Action): any {
  switch (action.type) {
    case "SET_VENDOR_DATA":
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}

type VendorProviderProps = {
  vendor?: IVendor;
};

export const VendorProvider: React.FunctionComponent<VendorProviderProps> = ({
  children,
  vendor,
}) => {
  const [, dispatch] = useReducer(reducer, { vendor });

  useEffect(() => {
    if (vendor) {
      dispatch({
        type: "SET_VENDOR_DATA",
        payload: vendor,
      });
    }
  }, [vendor]);

  return (
    <VendorContext.Provider value={{ vendor, dispatch }}>
      {children}
    </VendorContext.Provider>
  );
};
