import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "settings/constants";
import { IUser } from "types/User.types";
import Icon from "../Icon/Icon";

export interface IUserAvatarProps {
  user: Partial<IUser>;
  showName: boolean;
  size?: number;
}

const UserAvatar = ({ user, showName, size = 50 }: IUserAvatarProps) => (
  <div className="flex items-center" style={{ width: size, height: size }}>
    <div className="absolute inset-0 z-40 flex flex-wrap content-center justify-center opacity-0 hover:opacity-100 hover:bg-purple-300">
      <Icon icon="camera" size="2x" />
    </div>
    {user?.profileImage && user?.profileImage !== DEFAULT_PROFILE_IMAGE ? (
      <>
        <div
          className="bg-center bg-cover rounded-full border-2 border-current-500 dark:border-white bg-gray-900 dark:bg-white"
          style={{ width: size, height: size }}
        >
          <Image
            src={user?.profileImage}
            quality={100}
            width={size}
            height={size}
            className="rounded-full"
            alt="profile"
          />
        </div>
        {showName && (
          <p className="capitalize">
            {user?.name} {user?.lastname}
          </p>
        )}
      </>
    ) : (
      <>
        <div className="relative mr-4" style={{ width: size, height: size }}>
          <div
            className="absolute inset-0 bg-cover z-0 bg-current-600  mr-2 bg-center rounded-full border-2 border-current-500"
            style={{ width: size, height: size }}
          >
            <div
              className="absolute inset-0 flex justify-center items-center font-semibold text-md"
              style={{ fontSize: size * 0.32 }}
            >
              {`${user?.name?.charAt(0) || ""}${
                user?.lastname?.charAt(0) || ""
              }`}
            </div>
          </div>
        </div>
        {showName && (
          <p className="capitalize ml-2">
            {user?.name} {user?.lastname}
          </p>
        )}
      </>
    )}
  </div>
);

export default UserAvatar;
