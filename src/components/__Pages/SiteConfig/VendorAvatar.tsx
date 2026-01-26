import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IVendor } from "types/Vendor.types";

import { VendorAvatarContent } from "./Vendor.style";

interface IProps {
  logo: string;
  vendor: IVendor;
}

export const VendorAvatar = (props: IProps) => {
  const { vendor, logo } = props;

  return (
    <>
      <div className="absolute inset-0 z-40 flex flex-wrap content-center justify-center opacity-0 hover:opacity-100 hover:bg-purple-300">
        <FontAwesomeIcon icon={faCamera} />
      </div>
      {logo || vendor?.logo ? (
        <VendorAvatarContent
          style={{
            backgroundImage: `url(${logo || vendor?.logo})`,
          }}
          className="border-2 border-current-500"
        />
      ) : (
        <div className="text-black bg-white bg-center bg-cover border-2 rounded-full border-current-500 dark:bg-gray-900 dark:text-white w-full h-full">
          <div
            className="absolute inset-0 flex items-center justify-center font-semibold text-md "
            style={{ fontSize: 120 * 0.32 }}
          >
            {`${vendor?.name?.charAt(0).toUpperCase() || ""}${
              vendor?.name?.split(" ").length > 1
                ? vendor?.name.split(" ")[1]?.charAt(0).toUpperCase()
                : ""
            }`}
          </div>
        </div>
      )}
    </>
  );
};
