import { useQuery } from "@apollo/client";
import { gqlUser } from "gql";
import React, { useEffect, useReducer } from "react";
import { USER_TOKEN_PERSIST } from "settings/constants";
import { IUser } from "types/User.types";
import { ProfileContext } from "./profile.context";

type Action =
  | { type: "UPDATE_SELECTED_VENDOR"; payload: any }
  | { type: "SET_USER_DATA"; payload: any }
  | { type: "CLEAN_USER"; payload: any };

function reducer(state: any, action: Action): any {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "CLEAN_USER":
      return {
        ...state,
        data: null,
      };
    default:
      return state;
  }
}

type ProfileProviderProps = {};

const isBrowser = typeof window !== "undefined";

export const ProfileProvider: React.FunctionComponent<ProfileProviderProps> = ({
  children,
}) => {
  const { data: userData, error } = useQuery<
    { user: IUser },
    { accessToken: string }
  >(gqlUser.queries.GET_FULL_USER, {
    skip: !(isBrowser && localStorage.getItem(USER_TOKEN_PERSIST)),
    fetchPolicy: "cache-and-network",
    variables: {
      accessToken:
        typeof window === "undefined"
          ? ""
          : localStorage.getItem(USER_TOKEN_PERSIST),
    },
  });

  const [, dispatch] = useReducer(reducer, { userData });

  useEffect(() => {
    if (userData) {
      dispatch({
        type: "SET_USER_DATA",
        payload: userData,
      });
    }
  }, [userData]);

  if (error) return <div>{error.message}</div>;

  return (
    <ProfileContext.Provider value={{ user: userData?.user, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};
