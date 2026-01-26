import { useLazyQuery, useMutation } from "@apollo/client";
import PasswordInput from "components/_Custom/PasswordInput";
import { Recovery } from "components/__Pages/Recovery/Forms/Recovery";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlUser } from "gql";
import { ILoginInput, ILoginResponse } from "gql/User/queries";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "rsuite";
import {
  AFTER_LOGIN_REDIRECT,
  REFRESH_TOKEN_PERSIST,
  USER_TOKEN_PERSIST,
} from "settings/constants";
import isEmail from "validator/lib/isEmail";

export const LoginForm = () => {
  const {
    handleSubmit: handleLoginSubmit,
    control: loginControl,
    formState: { errors },
  } = useForm<ILoginInput>();
  const router = useRouter();
  const { openDrawer, closeDrawer } = useDrawer();

  const { t } = useTranslation("common");

  const [getUser, { loading: getUserLoading }] = useLazyQuery(
    gqlUser.queries.GET_USER,
  );

  const [login, { loading: loginLoading, error: loginError }] = useMutation<
    { login: ILoginResponse },
    { loginInput: ILoginInput }
  >(gqlUser.queries.LOGIN, {
    onCompleted({ login }) {
      const { accessToken, refreshToken } = login;
      localStorage.setItem(USER_TOKEN_PERSIST, `${accessToken}`);
      localStorage.setItem(REFRESH_TOKEN_PERSIST, `${refreshToken}`);

      getUser({
        variables: {
          accessToken,
        },
      });

      closeDrawer();
      router.push(AFTER_LOGIN_REDIRECT);
    },
    onError() {},
  });

  const handleLogin = (data: ILoginInput) => {
    try {
      login({
        variables: {
          loginInput: {
            ...data,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecovery = () => {
    openDrawer({
      drawerComponent: <Recovery />,
    });
  };

  return (
    <div className="w-full p-5">
      <form onSubmit={handleLoginSubmit(handleLogin)} className="mt-3">
        <label className="font-bold mb-2">{t("login.enterEmail")}</label>
        <Controller
          name="email"
          control={loginControl}
          rules={{ required: true, validate: (value) => isEmail(value) }}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              autoCapitalize="none"
              placeholder={t("login.enterEmailPlaceholder")}
            />
          )}
        />
        {errors && errors.email && (
          <small className="w-full text-red-500">
            {t("login.enterValidEmail")}
          </small>
        )}
        <label className="font-bold mt-6 mb-2 block">
          {t("login.enterPassword")}
        </label>
        <Controller
          name="password"
          control={loginControl}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <PasswordInput
              {...field}
              type="password"
              autoCapitalize="none"
              placeholder={t("login.enterEmailPlaceholder")}
            />
          )}
        />
        {errors && errors.password && (
          <small className="w-full text-red-500">
            {t("login.enterPasswordError")}
          </small>
        )}
        <div
          aria-hidden="true"
          className="flex flex-col justify-end mt-4 mb-4 text-xs text-gray-300"
        >
          <div
            onClick={handleRecovery}
            onKeyPress={handleRecovery}
            role="button"
            tabIndex={0}
            className="inline text-blue-400 cursor-pointer"
          >
            {t("login.recoverPassword")}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            appearance="primary"
            className="rs-btn-big w-full"
            loading={loginLoading || getUserLoading}
            type="submit"
          >
            {t("login.accessButton")}
          </Button>
        </div>
        {loginError && (
          <p className="w-full text-red-500 mt-4">{loginError.message}</p>
        )}
      </form>
    </div>
  );
};
