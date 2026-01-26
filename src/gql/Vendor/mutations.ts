import { gql } from "@apollo/client";
import { IUser } from "types/User.types";
import { IAddress, IColor, IVendor, IVendorBanner } from "types/Vendor.types";

export interface ICreateVendorInput {
  name: string;
}

export interface ICreateVendorResponse {
  createVendor: IVendor;
}

export const CREATE_VENDOR = gql`
  mutation CreateVendor($createVendorInput: CreateVendorInput!) {
    createVendor(createVendorInput: $createVendorInput) {
      id
      name
      createdAt
    }
  }
`;

export interface IUpdateVendorInput {
  id: string;
  name?: string;
  logo?: string;
  banners?: IVendorBanner[];
  description?: string;
  phone?: string;
  address?: IAddress;
  colors?: IColor[];
}

export interface IUpdateVendorResponse {
  updateVendor: IVendor;
}

const UPDATE_VENDOR = gql`
  mutation updateVendor($updateVendorInput: UpdateVendorInput!) {
    updateVendor(updateVendorInput: $updateVendorInput) {
      id
    }
  }
`;

export interface ICreateVendorUserInput {
  email: string;
  lastname: string;
  name: string;
  password: string;
  roles?: string[];
}

export interface ICreateVendorUserResponse {
  createUserVendor: IUser;
}

const CREATE_USER_VENDOR = gql`
  mutation CreateUserVendor($createVendorUserInput: CreateVendorUserInput!) {
    createUserVendor(createVendorUserInput: $createVendorUserInput) {
      id
      name
      lastname
      email
      createdAt
      vendorRoles {
        id
        name
      }
    }
  }
`;

export interface IUpdateVendorUserInput extends ICreateVendorUserInput {
  id: string;
}

export interface IUpdateVendorUserResponse {
  updateUserVendor: IUser;
}

const UPDATE_USER_VENDOR = gql`
  mutation UpdateUserVendor($updateVendorUserInput: UpdateVendorUserInput!) {
    updateUserVendor(updateVendorUserInput: $updateVendorUserInput) {
      id
      name
      lastname
      email
      createdAt
      vendorRoles {
        id
        name
      }
    }
  }
`;

export interface IDeleteUserVendorInput {
  id: string;
}

export interface IDeleteUserVendorResponse {
  deleteVendorUser: IUser;
}

const DELETE_USER_VENDOR = gql`
  mutation DeleteVendorUser($deleteVendorUserInput: DeleteVendorUserInput!) {
    deleteVendorUser(deleteVendorUserInput: $deleteVendorUserInput) {
      id
    }
  }
`;

export default {
  CREATE_VENDOR,
  UPDATE_VENDOR,
  CREATE_USER_VENDOR,
  UPDATE_USER_VENDOR,
  DELETE_USER_VENDOR,
};