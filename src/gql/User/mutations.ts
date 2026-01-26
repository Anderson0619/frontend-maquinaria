import { gql } from "@apollo/client";

const SIGNUP = gql`
  mutation Signup($signUpInput: CreateUserInput!) {
    signup(signUpInput: $signUpInput) {
      accessToken
      refreshToken
    }
  }
`;

export interface IChangePasswordRequestInput {
  email: string;
}

const CHANGE_PASSWORD = gql`
  mutation ChangePassword(
    $changePasswordRequestInput: ChangePasswordRequestInput!
  ) {
    changePassword(changePasswordRequestInput: $changePasswordRequestInput) {
      id
      name
      email
      password
    }
  }
`;

export interface IChangePasswordInput {
  passwordRecoveryToken: string;
  userId: string;
  password: string;
}

const DO_RESET_PASSWORD = gql`
  mutation DoResetPassword($changePasswordInput: ChangePasswordInput!) {
    doResetPassword(changePasswordInput: $changePasswordInput) {
      id
    }
  }
`;

const UPDATE_USER_PROFILE = gql`
  mutation updateProfile($updateProfileInput: UpdateProfileInput!) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      id
    }
  }
`;

export interface IUpdateUserSelectedVendorInput {
  vendor: string;
}

const UPDATE_USER_SELECTED_VENDOR = gql`
  mutation updateUserSelectedVendor(
    $updateUserSelectedVendorInput: UpdateUserSelectedVendorInput!
  ) {
    updateUserSelectedVendor(
      updateUserSelectedVendorInput: $updateUserSelectedVendorInput
    ) {
      id
    }
  }
`;

const REFRESH_ACCESS_TOKEN = gql`
  mutation refreshAccessToken(
    $refreshAccessTokenInput: RefreshAccessTokenInput!
  ) {
    refreshAccessToken(refreshAccessTokenInput: $refreshAccessTokenInput) {
      accessToken
    }
  }
`;

export default {
  SIGNUP,
  CHANGE_PASSWORD,
  DO_RESET_PASSWORD,
  UPDATE_USER_PROFILE,
  UPDATE_USER_SELECTED_VENDOR,
  REFRESH_ACCESS_TOKEN,
};
