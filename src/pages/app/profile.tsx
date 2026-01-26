import { useMutation } from "@apollo/client";
import CropImage, { CropImageType } from "components/_Custom/CropImage";
import Icon from "components/_Custom/Icon/Icon";
import PasswordInput from "components/_Custom/PasswordInput";
import UserAvatar from "components/_Custom/UserAvatar/UserAvatar";
import UserCover from "components/_Custom/UserCover/UserCover";
import { useModal } from "context/modal/modal.provider";
import { useProfile } from "context/profile/profile.context";
import { gqlUser } from "gql";
import useTranslation from "next-translate/useTranslation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Col, Input, Loader, Row, Uploader } from "rsuite";
import { FileType } from "rsuite/esm/Uploader/Uploader";
import { ALLOWED_THUMBNAIL_EXTENSIONS } from "settings/constants";

const ProfilePage = () => {
  const { t } = useTranslation("common");
  const { openModal } = useModal();
  const { user } = useProfile();
  const { control, handleSubmit } = useForm();

  const [updateProfile, { loading: updateProfileLoading }] = useMutation(
    gqlUser.mutations.UPDATE_USER_PROFILE,
    {
      refetchQueries: ["user"],
      onCompleted() {
        toast.success(t("profile.updateSuccess"));
      },
      onError() {
        toast.error(t("profile.updateError"));
      },
    },
  );

  const handleUpdate = (data) => {
    updateProfile({
      variables: {
        updateProfileInput: {
          ...data,
        },
      },
    });
  };

  const cropCallback = (base64Result: string) => {
    updateProfile({
      variables: {
        updateProfileInput: {
          profileImage: base64Result,
        },
      },
    });
  };

  const handleProfileImageChange = (fileList: Array<FileType>) => {
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
              callback: cropCallback,
              cropShape: CropImageType.ROUND,
            }}
          />
        ),
      });
    };
  };

  return (
    <>
      <div className="flex items-center md:items-start justify-center flex-col">
        <UserCover />

        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="rs-avatar-circle md:ml-32 -mt-16">
            <Uploader
              action=""
              fileListVisible={false}
              accept={ALLOWED_THUMBNAIL_EXTENSIONS}
              onChange={handleProfileImageChange}
            >
              <button
                className="rounded-full"
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  padding: 0,
                }}
              >
                {updateProfileLoading && <Loader backdrop center />}
                {user?.profileImage ? (
                  <UserAvatar {...{ user, showName: false, size: 160 }} />
                ) : (
                  <Icon icon="plus" />
                )}
              </button>
            </Uploader>
          </div>
          <div className="mt-2 md:ml-6 ">
            <p className="break-words text-center md:text-left font-bold text-3xl">
              {user?.name} {user?.lastname}
            </p>
            <p className="text-center md:text-left text-gray-200">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5 mt-8 ">
        <Row className="flex justify-center w-full">
          <Col xs={24} lg={18}>
            {user && (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md">
                <div className="md:flex gap-4 mb-4">
                  <div className="mb-6 md:w-1/2 md:mb-0">
                    <label>{t("profile.name")}</label>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={user.name || ""}
                      render={({ field }) => (
                        <Input
                          placeholder={t("profile.namePlaceholder")}
                          {...field}
                        />
                      )}
                      rules={{ required: true }}
                    />
                  </div>
                  <div className="md:w-1/2">
                    <label>{t("profile.lastname")}</label>
                    <Controller
                      name="lastname"
                      control={control}
                      defaultValue={user.lastname || ""}
                      render={({ field }) => (
                        <Input
                          placeholder={t("profile.lastnamePlaceholder")}
                          {...field}
                        />
                      )}
                      rules={{ required: true }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label>{t("profile.email")}</label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={user.email || ""}
                    render={({ field }) => (
                      <Input
                        placeholder={t("profile.emailPlaceholder")}
                        {...field}
                      />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="mb-4">
                  <label>{t("profile.password")}</label>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue={user.password || ""}
                    render={({ field }) => (
                      <PasswordInput
                        placeholder={t("profile.passwordPlaceholder")}
                        {...field}
                      />
                    )}
                    rules={{ required: false }}
                  />
                </div>

                <div className="mb-4">
                  <label>{t("profile.phone")}</label>
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue={user.phone || ""}
                    render={({ field }) => (
                      <Input
                        placeholder={t("profile.phonePlaceholder")}
                        {...field}
                      />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    appearance="primary"
                    disabled={updateProfileLoading}
                    loading={updateProfileLoading}
                    onClick={handleSubmit(handleUpdate)}
                  >
                    {t("profile.updateBtn")}
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProfilePage;
