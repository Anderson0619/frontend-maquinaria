import { useQuery } from "@apollo/client";
import { gqlVendor } from "gql";
import { IGetVendorBannersInput } from "gql/Vendor/queries";
import Image from "next/image";
import React from "react";
import { Button } from "rsuite";
import { DEFAULT_SITE_VENDOR_ID, WIDTH_MD } from "settings/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { IVendorBanner } from "types/Vendor.types";
import useWindowSize from "utils/hooks/useWindowSize";

const VendorBanner = () => {
  const { data: vendorBannerData } = useQuery<
    { vendorBanners: IVendorBanner[] },
    { getVendorBannersInput: IGetVendorBannersInput }
  >(gqlVendor.queries.GET_VENDOR_BANNERS, {
    variables: {
      getVendorBannersInput: {
        vendor: DEFAULT_SITE_VENDOR_ID,
      },
    },
  });

  const wsize = useWindowSize();
  const bannerStyle = {
    height: wsize.width <= WIDTH_MD ? "60vh" : "80vh",
    minHeight: 200,
  };

  const handleCallToAction = (cta: string) => {
    if (cta) {
      window.open(cta, "_blank");
    }
  };

  const BannerCard = () => (
    <div className="w-full ">
      <Swiper className="swiper" navigation pagination={{ clickable: true }}>
        {vendorBannerData?.vendorBanners?.map(
          ({
            bannerUrl,
            title,
            description,
            btnText,
            btnColor,
            align,
            cta,
          }) => (
            <SwiperSlide key={bannerUrl} style={bannerStyle}>
              <div className="absolute top-0 left-0 w-full h-full z-0 ">
                <Image
                  src={bannerUrl}
                  objectFit="cover"
                  layout="fill"
                  className="rounded-md"
                  alt="banner"
                />
              </div>
              <div
                className={`w-full h-full flex flex-col items-${align} justify-center gap-3 z-7 absolute top-0 left-0 bg-gradient-to-t from-gray-800 dark:from-black px-24`}
              >
                <h2 className="font-bold text-5xl text-white">{title}</h2>
                <p className="text-white">{description}</p>
                {btnText && (
                  <div>
                    <Button
                      style={{ backgroundColor: btnColor }}
                      onClick={() => handleCallToAction(cta)}
                    >
                      {btnText}
                    </Button>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ),
        )}
      </Swiper>
    </div>
  );

  return <BannerCard />;
};
export default VendorBanner;
