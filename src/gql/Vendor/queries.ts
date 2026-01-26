import { gql } from "@apollo/client";
import { IVendor } from "types/Vendor.types";

const GET_USER_VENDOR = gql`
  query userVendor {
    userVendor {
      name
      banners {
        title
        description
        bannerUrl
        cta
        btnColor
        btnText
        align
        modal
      }
    }
  }
`;

export interface IGetVendorBannersInput {
  vendor: string;
}

const GET_VENDOR_BANNERS = gql`
  query vendorBanners($getVendorBannersInput: GetVendorBannersInput!) {
    vendorBanners(getVendorBannersInput: $getVendorBannersInput) {
      title
      description
      bannerUrl
      cta
      btnColor
      btnText
      align
      modal
    }
  }
`;

const VENDOR_USERS = gql`
  query VendorUsers {
    vendorUsers {
      id
      name
      lastname
      email
      phone
      vendorRoles {
        id
        name
      }
    }
  }
`;

export interface IGetVendorsResponse {
  vendors: IVendor[];
}

const VENDORS = gql`
  query Vendors {
    vendors {
      id
      name
      createdAt
    }
  }
`;

export interface IGetVendorResponse {
  vendor: IVendor;
}

const GET_VENDOR = gql`
  query vendor {
    vendor {
      name
      colors {
        color
        type
      }
      phone
      logo
      description
      domains
      url
      thumbnail
      address {
        address
        lat
        lng
      }
      banners {
        title
        description
        bannerUrl
        btnColor
        btnText
        align
        cta
      }
    }
  }
`;

export interface IGetCurrentVendorResponse {
  currentVendor: IVendor;
}

const GET_CURRENT_VENDOR = gql`
  query CurrentVendor {
    currentVendor {
      id
      name
      colors {
        color
        type
      }
      phone
      logo
      description
      domains
      url
      thumbnail
      address {
        address
        lat
        lng
      }
      banners {
        title
        description
        bannerUrl
        btnColor
        btnText
        align
        cta
      }
    }
  }
`;

export default {
  GET_USER_VENDOR,
  GET_VENDOR_BANNERS,
  VENDOR_USERS,
  VENDORS,
  GET_VENDOR,
  GET_CURRENT_VENDOR,
};