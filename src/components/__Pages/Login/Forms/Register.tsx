import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import PasswordInput from "components/_Custom/PasswordInput";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlUser, gqlVendor } from "gql";
import { IGetVendorsResponse } from "gql/Vendor/queries";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, Input, Row, SelectPicker } from "rsuite";
import {
  AFTER_LOGIN_REDIRECT,
  REFRESH_TOKEN_PERSIST,
  USER_TOKEN_PERSIST,
} from "settings/constants";
import isEmail from "validator/lib/isEmail";

export const RegisterForm = () => {
  const {
    handleSubmit: handleRegisterSubmit,
    control: registerControl,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { closeDrawer } = useDrawer();

  const { data: vendorsData } = useQuery<IGetVendorsResponse>(
    gqlVendor.queries.VENDORS,
    {
      nextFetchPolicy: "cache-and-network",
    },
  );

  const { t } = useTranslation("common");

  const [getUser, { data: getUserData, loading: getUserLoading }] =
    useLazyQuery(gqlUser.queries.GET_USER);

  const [signup, { loading: signupLoading, error: signupError }] = useMutation(
    gqlUser.mutations.SIGNUP,
    {
      onCompleted({ signup }) {
        const { accessToken, refreshToken } = signup;
        localStorage.setItem(USER_TOKEN_PERSIST, `${accessToken}`);
        localStorage.setItem(REFRESH_TOKEN_PERSIST, `${refreshToken}`);
        getUser({
          variables: {
            accessToken,
          },
        });

        closeDrawer();
      },
    },
  );

  useEffect(() => {
    if (getUserData) {
      router.push(AFTER_LOGIN_REDIRECT);
    }
  }, [getUserData]);

  const handleRegister = async (data) => {
    if (typeof window !== "undefined") {
      try {
        await signup({
          variables: {
            signUpInput: {
              ...data,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full p-5">
      <Header {...{ title: t("register.registerTitle"), description: "" }} />
      <form onSubmit={handleRegisterSubmit(handleRegister)}>
        <Row>
          <Col xs={24}>
            <label className="font-bold" htmlFor="name">
              {t("register.nameQuestion")}
            </label>

            <Controller
              name="name"
              defaultValue=""
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("register.nameQuestionPlaceholder")}
                />
              )}
            />
            {errors && errors.name && (
              <small className="w-full text-red-500">
                {t("register.nameQuestionError")}
              </small>
            )}
          </Col>
          <Col xs={24}>
            <label className="font-bold mt-2 block">
              {" "}
              {t("register.lastNameQuestion")}
            </label>
            <Controller
              name="lastname"
              defaultValue=""
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("register.lastNameQuestionPlaceholder")}
                />
              )}
            />
            {errors && errors.lastname && (
              <small className="w-full text-red-500">
                {t("register.lastNameQuestionError")}
              </small>
            )}
          </Col>
          <Col xs={24}>
            <label className="font-bold mt-2 block">
              {t("register.emailQuestion")}
            </label>
            <Controller
              name="email"
              defaultValue=""
              control={registerControl}
              rules={{ required: true, validate: (value) => isEmail(value) }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder={t("register.emailQuestionPlaceholder")}
                />
              )}
            />
            {errors && errors.email && (
              <small className="w-full text-red-500">
                {t("register.emailQuestionError")}
              </small>
            )}
          </Col>
          <Col xs={24}>
            <label className="font-bold mt-2 block">
              {t("register.enterPassword")}
            </label>
            <Controller
              name="password"
              defaultValue=""
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder={t("register.enterPasswordPlaceholder")}
                />
              )}
            />
            {errors && errors.password && (
              <small className="w-full text-red-500">
                {t("register.enterPasswordError")}
              </small>
            )}
          </Col>
          {!!vendorsData?.vendors.length && (
            <Col xs={24}>
              <label className="font-bold mt-2 block">
                {t("register.vendorName")}
              </label>
              <Controller
                name="vendor"
                defaultValue=""
                control={registerControl}
                rules={{ required: true }}
                render={({ field }) => (
                  <SelectPicker
                    {...field}
                    labelKey="name"
                    valueKey="id"
                    data={vendorsData?.vendors}
                    searchable={false}
                    cleanable={false}
                    className="w-full"
                    placeholder={t("register.vendorNamePlaceholder")}
                  />
                )}
              />
            </Col>
          )}
          <Col xs={24}>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                appearance="ghost"
                onClick={closeDrawer}
                className="rs-btn-big"
              >
                <span>{t("buttons.cancel")}</span>
              </Button>
              <Button
                appearance="primary"
                className="rs-btn-big"
                type="submit"
                loading={signupLoading || getUserLoading}
              >
                {t("register.accessButton")}
              </Button>
            </div>
            {signupError && (
              <p className="w-full text-red-500 text-right mt-4">
                {signupError.message}
              </p>
            )}
          </Col>
        </Row>
      </form>
    </div>
  );
};
