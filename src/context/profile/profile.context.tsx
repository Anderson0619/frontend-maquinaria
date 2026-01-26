import { createContext, Dispatch, useContext } from "react";
import { IUser } from "types/User.types";

interface IProfileContext {
  user: IUser;
  dispatch: Dispatch<unknown>;
}

const ProfileContextMethods = {
  user: null,
  dispatch: () => {},
};

export const ProfileContext = createContext<IProfileContext>(
  ProfileContextMethods,
);

export const useProfile = () => useContext(ProfileContext);
