import UserAvatar from "components/_Custom/UserAvatar/UserAvatar";
import React from "react";
import { IUser } from "types/User.types";

interface IUserCardProps extends IUser {}
const UserCard = (props: IUserCardProps) => {
  const { name, email } = props;
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-md flex gap-3 items-center justify-start mb-3">
      <UserAvatar user={props} showName={false} size={43} />
      <div>
        <span className="text-lg font-bold block">{name}</span>
        <span className="text-sm block italic text-gray-500">{email}</span>
      </div>
    </div>
  );
};

export default UserCard;
