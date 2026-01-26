import { useMutation } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import PasswordInput from "components/_Custom/PasswordInput";
import { gqlUser } from "gql";
import { IChangePasswordInput } from "gql/User/mutations";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "rsuite";
import { IUser } from "types/User.types";

const RecoveryPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm();

  const { tkn, userId } = router.query as { tkn: string; userId: string };
  const [completed, setCompleted] = useState<boolean>(false);
  const [doResetPassword, { loading: recoveryLoading, error: loginError }] =
    useMutation<
      { doResetPassword: IUser },
      { changePasswordInput: IChangePasswordInput }
    >(gqlUser.mutations.DO_RESET_PASSWORD, {
      onCompleted() {
        setCompleted(true);
      },
      onError() {},
    });

  const handleResetPassword = (data: IChangePasswordInput) => {
    try {
      doResetPassword({
        variables: {
          changePasswordInput: {
            passwordRecoveryToken: tkn,
            userId,
            password: data.password,
          },
        },
      });
    } catch (e) {
      console.error("👀 error", e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-screen h-screen flex flex-col justify-center p-5">
      {!completed && (
        <div className="mx-auto">
          <Header
            title={t("reset.headers.resetTitle")}
            description={t("reset.headers.resetDescription")}
          />

          <form onSubmit={handleSubmit(handleResetPassword)} className="w-full">
            <label className="font-bold">{t("reset.forms.newPassword")}</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder={t("reset.forms.newPasswordPlaceholder")}
                />
              )}
            />
            {errors && errors.email && (
              <small className="w-full text-red-500">
                {t("reset.forms.newPasswordRequired")}
              </small>
            )}

            <label className="font-bold">
              {" "}
              {t("reset.forms.repeatPassword")}
            </label>
            <Controller
              name="password_repeat"
              control={control}
              rules={{
                required: true,
                validate: (value) =>
                  value === getValues("password") ||
                  t("reset.forms.passwordsNotMatch"),
              }}
              defaultValue=""
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder={t("reset.forms.repeatPasswordPlaceholder")}
                />
              )}
            />
            {errors && errors.password_repeat && (
              <small className="w-full text-red-500 v">
                {errors.password_repeat.type === "required"
                  ? t("reset.forms.repeatPasswordRequired")
                  : errors.password_repeat.message}
              </small>
            )}

            <Button
              appearance="primary"
              className="mt-5 w-full rs-btn-big"
              loading={recoveryLoading}
              type="submit"
            >
              {t("reset.forms.resetPassword")}
            </Button>

            <div
              aria-hidden="true"
              className="flex flex-col justify-end mt-4 mb-4 text-xs text-gray-300"
            >
              <div
                onClick={() => router.push("/login")}
                onKeyPress={() => router.push("/login")}
                role="button"
                tabIndex={0}
                className="inline text-blue-400 cursor-pointer"
              >
                {t("reset.forms.goToLogin")}
              </div>
            </div>

            {loginError && (
              <p className="w-full text-red-500 text-center mt-4">
                {loginError.message}
              </p>
            )}
          </form>
        </div>
      )}
      {completed && (
        <div className="mx-auto">
          <Header
            title={t("reset.headers.resetTitleSuccess")}
            description={t("reset.headers.resetDescriptionSuccess")}
          />
          <Button
            appearance="primary"
            size="lg"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            {t("reset.forms.login")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default RecoveryPage;
