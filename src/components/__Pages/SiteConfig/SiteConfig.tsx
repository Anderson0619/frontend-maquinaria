import { useMutation, useQuery } from "@apollo/client";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleMap, Marker } from "@react-google-maps/api";
import CropImage, { CropImageType } from "components/_Custom/CropImage";
import Header from "components/_Custom/Header/Header";
import Icon from "components/_Custom/Icon/Icon";
import InputSearchAddress, {
  IPlace,
  IPlaceGeometryLocation,
} from "components/_Custom/InputSearchAddress/InputSearchAddress";
import VendorBanners from "components/_Custom/VendorBanners/VendorBanners";
import { useModal } from "context/modal/modal.provider";
import { useProfile } from "context/profile/profile.context";
import { gqlUser, gqlVendor } from "gql";
import {
  ICreateVendorInput,
  IUpdateVendorResponse,
} from "gql/Vendor/mutations";
import { IGetCurrentVendorResponse } from "gql/Vendor/queries";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SliderPicker } from "react-color";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Col,
  Input,
  InputGroup,
  Loader,
  Nav,
  Row,
  TagPicker,
  Uploader,
} from "rsuite";
import { FileType } from "rsuite/esm/Uploader/Uploader";
import { ALLOWED_THUMBNAIL_EXTENSIONS } from "settings/constants";
import { EColorType, IAddress, IVendorBanner } from "types/Vendor.types";
import { getQueryOperator } from "utils/helpers";
import { VendorAvatar } from "./VendorAvatar";

const SiteConfigPage = () => {
  const { t } = useTranslation("common");
  const [vendorBanners, setVendorBanners] = useState<IVendorBanner[]>([]);
  const [logo, setLogo] = useState("");
  const [active, setActive] = useState<string>("info");
  const [address, setAddress] = useState<IAddress>(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#00bcd4");

  const { user } = useProfile();
  const { openModal } = useModal();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: vendorData, loading } = useQuery<IGetCurrentVendorResponse>(
    gqlVendor.queries.GET_CURRENT_VENDOR,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [updateVendor, { loading: updateVendorLoading }] =
    useMutation<IUpdateVendorResponse>(gqlVendor.mutations.UPDATE_VENDOR, {
      awaitRefetchQueries: true,
      refetchQueries: [
        getQueryOperator(gqlVendor.queries.GET_VENDOR),
        getQueryOperator(gqlUser.queries.GET_FULL_USER),
      ],
      onCompleted: () => {
        toast.success(t("config.updateVendorSuccess"));
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const handleUpdateVendor = (data: ICreateVendorInput) => {
    updateVendor({
      variables: {
        updateVendorInput: {
          id: vendorData?.currentVendor?.id,
          ...data,
          address,
          banners: vendorBanners,
          colors: [
            {
              color: primaryColor,
              type: EColorType.PRIMARY,
            },
          ],
          thumbnail,
        },
      },
    });
  };

  const handleSelectPlace = (place: IPlace) => {
    setAddress({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  const handleMarkerDrag = (e: { latLng: IPlaceGeometryLocation }) => {
    setAddress((address) => ({
      ...address,
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }));
  };

  const handleLogo = (fileList: Array<FileType>) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileList[fileList.length - 1].blobFile as File);
    reader.onloadend = () => {
      const base64Img = reader.result as string;
      setLogo(base64Img);
    };
  };

  const handleThumbnailImageChange = (fileList: Array<FileType>) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileList[fileList.length - 1].blobFile as File);
    reader.onloadend = () => {
      const base64Img = reader.result as string;
      openModal({
        backdrop: "static",
        modalComponent: (
          <CropImage
            {...{
              base64Img,
              callback: setThumbnail,
              cropShape: CropImageType.ROUND,
            }}
          />
        ),
      });
    };
  };

  useEffect(() => {
    if (vendorData?.currentVendor) {
      setValue("name", vendorData.currentVendor.name);
      setValue("description", vendorData.currentVendor.description);
      setValue("phone", vendorData.currentVendor.phone);
      setValue("email", vendorData.currentVendor.email);
      setValue("url", vendorData.currentVendor.url);

      setPrimaryColor(
        vendorData.currentVendor.colors?.find(
          (c) => c.type === EColorType.PRIMARY,
        )?.color || "#00bcd4",
      );
      setVendorBanners(vendorData.currentVendor.banners || []);
      setAddress(vendorData.currentVendor.address);
      setThumbnail(vendorData.currentVendor.thumbnail);
      setValue("domains", vendorData.currentVendor.domains);
    }
  }, [vendorData]);

  return (
    <Row>
      <Col md={24} lg={24}>
        <Header
          title={t("config.title")}
          description={t("config.description")}
          buttonAction={handleSubmit(handleUpdateVendor)}
          buttonLabel={t("config.buttonLabel")}
          buttonLoading={updateVendorLoading}
        />
        <div>
          <Nav
            activeKey={active}
            onSelect={setActive}
            appearance="subtle"
            className="mb-5"
          >
            <Nav.Item eventKey="info">
              {t("config.information.navTitle")}
            </Nav.Item>
            <Nav.Item eventKey="banner">
              {t("config.banners.navTitle")}
            </Nav.Item>
            <Nav.Item eventKey="extra">{t("config.extra.navTitle")}</Nav.Item>
            <Nav.Item eventKey="seo">{t("config.seo.navTitle")}</Nav.Item>
          </Nav>
        </div>
        {loading && <Loader backdrop center />}
        <form onSubmit={handleSubmit(handleUpdateVendor)} className="w-full">
          <Row>
            {active === "info" && (
              <>
                <Col md={6} lg={3} xs={24}>
                  <Uploader
                    action=""
                    fileListVisible={false}
                    accept={ALLOWED_THUMBNAIL_EXTENSIONS}
                    onChange={handleLogo}
                  >
                    <button
                      type="button"
                      style={{
                        width: "8rem",
                        height: "8rem",
                        borderRadius: "50%",
                        padding: 0,
                      }}
                    >
                      <VendorAvatar
                        vendor={vendorData?.currentVendor}
                        logo={logo || vendorData?.currentVendor?.logo}
                      />
                    </button>
                  </Uploader>
                </Col>
                <Col md={18} lg={21} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.information.siteName")}
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t(
                          "config.information.siteNamePlaceholder",
                        )}
                      />
                    )}
                  />
                  {errors && errors.name && (
                    <small className="w-full text-red-500">
                      {t("config.information.siteNameError")}
                    </small>
                  )}
                </Col>
                <Col md={24} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.information.phone")}
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroup.Addon>
                          <FontAwesomeIcon icon={faPhone} />
                        </InputGroup.Addon>
                        <Input
                          {...field}
                          placeholder={t("config.information.phonePlaceholder")}
                        />
                      </InputGroup>
                    )}
                  />
                </Col>
                <Col md={24} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.information.email")}
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroup.Addon> @</InputGroup.Addon>
                        <Input
                          {...field}
                          placeholder={t("config.information.emailPlaceholder")}
                        />
                      </InputGroup>
                    )}
                  />
                </Col>

                <Col md={24} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.information.domains")}
                  </label>
                  <Controller
                    name="domains"
                    control={control}
                    render={({ field }) => (
                      <TagPicker
                        {...field}
                        creatable
                        className="w-full"
                        data={
                          vendorData?.currentVendor?.domains.map((d) => ({
                            label: d,
                            value: d,
                          })) || []
                        }
                        disabled={!user.root}
                      />
                    )}
                  />
                </Col>
              </>
            )}

            {active === "banner" && (
              <Col md={24} xs={24}>
                <label className="font-bold mt-3 mb-2 block">
                  {t("config.banners.title")}
                </label>
                <VendorBanners
                  currentBanners={vendorBanners}
                  onChange={setVendorBanners}
                />
              </Col>
            )}

            {active === "extra" && (
              <>
                <Col md={24} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.extra.address")}
                  </label>
                  <InputSearchAddress
                    data={[]}
                    placeholder={t("config.extra.addressPlaceholder")}
                    onSelectPlace={handleSelectPlace}
                  />
                  {address && (
                    <>
                      <small className="mt-3 text-md">{address.address}</small>
                      <GoogleMap
                        mapContainerClassName="event-form-map rounded-xl mt-3"
                        center={{
                          lat: address.lat,
                          lng: address.lng,
                        }}
                        zoom={16}
                      >
                        <Marker
                          onDragEnd={handleMarkerDrag}
                          draggable
                          position={{
                            lat: address.lat,
                            lng: address.lng,
                          }}
                        />
                      </GoogleMap>
                    </>
                  )}
                </Col>
                <Col md={12} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.extra.primaryColorTitle")}
                  </label>
                  <SliderPicker
                    className="mt-3"
                    color={primaryColor}
                    onChangeComplete={(c: any) =>
                      setPrimaryColor(c?.hex as string)
                    }
                  />
                </Col>
              </>
            )}

            {active === "seo" && (
              <>
                <Col md={24} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.seo.url")}
                  </label>
                  <Controller
                    name="url"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroup.Addon>
                          <Icon icon="link" />
                        </InputGroup.Addon>
                        <Input
                          {...field}
                          placeholder={t("config.seo.urlPlaceholder")}
                        />
                      </InputGroup>
                    )}
                  />
                </Col>
                <Col md={4} xs={24}>
                  <label className="font-bold mt-3 block">
                    {t("config.seo.thumbnail")}
                  </label>
                  <Uploader
                    listType="picture"
                    autoUpload={false}
                    action=""
                    accept={ALLOWED_THUMBNAIL_EXTENSIONS}
                    multiple={false}
                    fileListVisible={false}
                    onChange={handleThumbnailImageChange}
                  >
                    <button style={{ width: 150, height: 150 }} type="button">
                      {updateVendorLoading && <Loader backdrop center />}
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          width="100%"
                          height="100%"
                          alt="thumbnail"
                        />
                      ) : (
                        <Icon icon="photo-film" size="2x" />
                      )}
                    </button>
                  </Uploader>
                </Col>
                <Col md={20} xs={24}>
                  <label className="font-bold mt-3 mb-2 block">
                    {t("config.seo.description")}
                  </label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Input
                        className="mt-3"
                        {...field}
                        as="textarea"
                        rows={7}
                        placeholder={t("config.seo.descriptionPlaceholder")}
                      />
                    )}
                  />
                </Col>
              </>
            )}
          </Row>
        </form>
      </Col>
    </Row>
  );
};

export default SiteConfigPage;
