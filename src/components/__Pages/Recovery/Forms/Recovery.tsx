import { useMutation } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { useModal } from "context/modal/modal.provider";
import { gqlUser } from "gql";
import { IChangePasswordRequestInput } from "gql/User/mutations";
import useTranslation from "next-translate/useTranslation";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "rsuite";
import { IUser } from "types/User.types";
import isEmail from "validator/lib/isEmail";
import { EmailSent } from "../EmailSent";

export const Recovery = () => {
  const {
    handleSubmit: handleLoginSubmit,
    control: loginControl,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation("common");

  const { openModal } = useModal();
  const { closeDrawer } = useDrawer();

  const [changePassword, { loading: recoveryLoading, error: loginError }] =
    useMutation<
      { changePassword: IUser },
      { changePasswordRequestInput: IChangePasswordRequestInput }
    >(gqlUser.mutations.CHANGE_PASSWORD, {
      onCompleted({ changePassword }) {
        closeDrawer();
        openModal({
          modalComponent: <EmailSent {...changePassword} />,
          size: "sm",
        });
      },
      onError() {},
    });

  const handleRecovery = (data) => {
    try {
      changePassword({
        variables: {
          changePasswordRequestInput: {
            email: data.email,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full p-5 ">
      <Header {...{ title: t("recovery.recoverTitle"), description: "" }} />
      <form onSubmit={handleLoginSubmit(handleRecovery)}>
        <label className="font-bold">{t("recovery.enterEmail")}</label>
        <Controller
          name="email"
          control={loginControl}
          rules={{ required: true, validate: (value) => isEmail(value) }}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              className="mt-2"
              placeholder={t("recovery.enterEmailPlaceholder")}
            />
          )}
        />
        {errors && errors.email && (
          <small className="w-full text-red-500">
            {t("recovery.enterValidEmail")}
          </small>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <Button
            appearance="default"
            onClick={closeDrawer}
            className="rs-btn-big"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            appearance="primary"
            className="rs-btn-big"
            loading={recoveryLoading}
            type="submit"
          >
            {t("register.accessButton")}
          </Button>
        </div>
        {loginError && (
          <p className="w-full text-red-500 text-right mt-4">
            {loginError.message}
          </p>
        )}
      </form>
    </div>
  );
};
