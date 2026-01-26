import { gql } from "@apollo/client";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

const LOGIN = gql`
  mutation login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
    }
  }
`;

const GET_USER = gql`
  query GetMyUser {
    user {
      id
      profileImage
      name
      lastname
      email
    }
  }
`;

const GET_FULL_USER = gql`
  query user {
    user {
      id
      profileImage
      name
      lastname
      email
      userRoutes
      root
      selectedVendor {
        id
        name
      }
      vendorList {
        id
        name
      }
      vendorRoles {
        id
        name
        routes
      }        
    }
  }
`;

export default {
  GET_USER,
  GET_FULL_USER,
  LOGIN,
};
