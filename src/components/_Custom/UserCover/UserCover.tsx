import Image from "next/image";
import { DEFAULT_USER_COVER } from "settings/constants";

interface IUserCover {
  image?: string;
}

const UserCover = ({ image = DEFAULT_USER_COVER }: IUserCover) => (
  <div className="overflow-hidden h-52 w-full bg-gray-100 dark:bg-gray-900 rounded-lg relative">
    <Image alt="user cover" src={image} layout="fill" objectFit="cover" />
  </div>
);

export default UserCover;
