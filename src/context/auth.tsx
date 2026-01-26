import { useApolloClient } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useCallback, useContext } from "react";
import {
  REFRESH_TOKEN_PERSIST,
  USER_ID_PERSIST,
  USER_TOKEN_PERSIST,
  VENDOR_ID_PERSIST,
} from "settings/constants";

import { useProfile } from "./profile/profile.context";

const isBrowser = typeof window !== "undefined";

type AuthProps = {
  isAuthenticated: () => boolean;
  authenticate: Function;
  getRoles: Function;
  signout: Function;
};

export const AuthContext = React.createContext({} as AuthProps);

export const signOutActions = () => {
  localStorage.removeItem(USER_TOKEN_PERSIST);
  localStorage.removeItem(VENDOR_ID_PERSIST);
  localStorage.removeItem(USER_ID_PERSIST);
  localStorage.removeItem(REFRESH_TOKEN_PERSIST);
};

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const client = useApolloClient();
  const { dispatch } = useProfile();
  const isAuthenticated = useCallback((): boolean => {
    const userToken = isBrowser && localStorage.getItem(USER_TOKEN_PERSIST);
    return !!userToken;
  }, []);

  const getRoles = (): string => {
    const token = localStorage.getItem(USER_TOKEN_PERSIST);
    const decoded: any = token && jwt_decode(token);
    return decoded && decoded.role;
  };

  const authenticate = async ({ accessToken }, cb: Function) => {
    localStorage.setItem(USER_TOKEN_PERSIST, accessToken);
    setTimeout(cb, 100);
  };

  const signout = async () => {
    try {
      router
        .replace(`/login?signedOut=${new Date().getTime()}`)
        .then(async () => {
          await client.clearStore();
          await client.cache.reset();
          dispatch({
            type: "CLEAN_USER",
          });
          signOutActions();
        });
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticate,
        getRoles,
        signout,
      }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
