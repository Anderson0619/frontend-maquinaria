import { useMutation, useQuery } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import PasswordInput from "components/_Custom/PasswordInput";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlRole, gqlVendor } from "gql";
import { IGetRolesResponse } from "gql/Role/queries";
import {
  ICreateVendorUserInput,
  ICreateVendorUserResponse,
  IUpdateVendorUserInput,
  IUpdateVendorUserResponse,
} from "gql/Vendor/mutations";
import useTranslation from "next-translate/useTranslation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Col, Input, Row, TagPicker } from "rsuite";
import { IUser } from "types/User.types";
import { v4 as uuid } from "uuid";
import isEmail from "validator/lib/isEmail";

interface IEditUserProps {
  user?: IUser;
}

const CreateOrUpdateUser = ({ user }: IEditUserProps) => {
  const { closeDrawer } = useDrawer();
  const { t } = useTranslation("common");
  const tempId: string = uuid();

  const { data: roleData } = useQuery<IGetRolesResponse>(
    gqlRole.queries.GET_ALL_ROLES,
    {
      nextFetchPolicy: "cache-and-network",
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const [createUserVendor, { loading: createUserVendorLoading }] = useMutation<
    ICreateVendorUserResponse,
    { createVendorUserInput: ICreateVendorUserInput }
  >(gqlVendor.mutations.CREATE_USER_VENDOR, {
    update: (cache, { data }) => {
      if (data) {
        const { createUserVendor } = data;
        if (createUserVendor) {
          const { vendorUsers } = cache.readQuery<{ vendorUsers: IUser[] }>({
            query: gqlVendor.queries.VENDOR_USERS,
          });

          if (vendorUsers)
            cache.writeQuery({
              query: gqlVendor.queries.VENDOR_USERS,
              data: {
                vendorUsers: [...vendorUsers, createUserVendor],
              },
            });
        }
      }
    },
    onCompleted: () => {},
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateUserVendor, { loading: updateUserVendorLoading }] = useMutation<
    IUpdateVendorUserResponse,
    { updateVendorUserInput: IUpdateVendorUserInput }
  >(gqlVendor.mutations.UPDATE_USER_VENDOR, {
    update: (cache, { data }) => {
      if (data) {
        const { updateUserVendor } = data;
        if (updateUserVendor) {
          const { vendorUsers } = cache.readQuery<{ vendorUsers: IUser[] }>({
            query: gqlVendor.queries.VENDOR_USERS,
          });

          if (vendorUsers)
            cache.writeQuery({
              query: gqlVendor.queries.VENDOR_USERS,
              data: {
                vendorUsers: vendorUsers.map((vendorUser) =>
                  vendorUser.id === updateUserVendor.id
                    ? updateUserVendor
                    : vendorUser,
                ),
              },
            });
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateVendorUserInput>({
    defaultValues: {
      name: user?.name || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      password: user?.password || "",
      roles: user?.vendorRoles.map((role) => role.id) || [],
    },
  });

  const handleCreateOrUpdateUser = (data: ICreateVendorUserInput) => {
    try {
      if (user) {
        updateUserVendor({
          variables: {
            updateVendorUserInput: {
              id: user.id,
              ...data,
            },
          },
          optimisticResponse: {
            updateUserVendor: {
              id: user.id,
              name: data.name,
              lastname: data.lastname,
              email: data.email,
              password:data.password
            },
          },
        });
      } else {
        createUserVendor({
          variables: {
            createVendorUserInput: {
              ...data,
            },
          },
          optimisticResponse: {
            createUserVendor: {
              id: tempId,
              name: data.name,
              lastname: data.lastname,
              email: data.email,
              password: data.password,
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (user) toast.success(t("users.forms.updateSuccess"));
      else toast.success(t("users.forms.creationSuccess"));
      closeDrawer();
    }
  };

  return (
    <div className="p-6">
      <Header
        title={
          user ? t("users.forms.updateTitle") : t("users.forms.createTitle")
        }
      />

      <form onSubmit={handleSubmit(handleCreateOrUpdateUser)}>
        <Row>
          <Col xs={24}>
            <label className="font-bold">{t("users.name")}</label>
            <Controller
              name="name"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t("users.name")} />
              )}
            />
            {errors?.name && (
              <span className="text-red-500">
                {t("register.nameQuestionError")}
              </span>
            )}
          </Col>
          <Col xs={24}>
            <label className="font-bold"> {t("users.lastname")} </label>
            <Controller
              name="lastname"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t("users.lastname")} />
              )}
            />
            {errors?.lastname && (
              <span className="text-red-500">
                {" "}
                {t("register.lastNameQuestionError")}
              </span>
            )}
          </Col>

          <Col xs={24}>
            <label className="font-bold"> {t("users.email")} </label>
            <Controller
              name="email"
              rules={{ required: true, validate: (value) => isEmail(value) }}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="example@nodrize.com" />
              )}
            />
            {errors?.email && errors?.email.type === "validate" && (
              <span className="text-red-500">{t("login.enterValidEmail")}</span>
            )}
            {errors?.email && errors?.email.type === "required" && (
              <span className="text-red-500">{t("login.enterValidEmail")}</span>
            )}
          </Col>

          <Col xs={24}>
            <label className="font-bold"> {t("users.password")} </label>
            <Controller
              name="password"
              rules={{ required: !!user }}
              control={control}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder={t("login.enterPasswordPlaceholder")}
                />
              )}
            />

            {errors?.email && errors?.password.type === "required" && (
              <span className="text-red-500">
                {t("login.enterPasswordError")}
              </span>
            )}
          </Col>
          <Col xs={24} className="mt-2">
            <label>{t("users.forms.roles")}</label>
            <Controller
              name="roles"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TagPicker
                  {...field}
                  size="lg"
                  style={{ width: "100%" }}
                  data={roleData?.getAllRoles || []}
                  labelKey="name"
                  valueKey="id"
                  placeholder={t("users.forms.rolesPlaceholder")}
                />
              )}
            />
            {errors && errors.roles && (
              <small className="w-full text-red-500 mb-2">
                {t("users.forms.rolesRequired")}
              </small>
            )}
          </Col>

          <Col md={24} className="mb-3">
            <div className="flex mt-6 justify-end">
              <Button
                appearance="default"
                className="rs-btn-big"
                onClick={closeDrawer}
              >
                <span className="">{t("buttons.cancel")}</span>
              </Button>
              <Button
                appearance="primary"
                className="ml-2 rs-btn-big"
                type="submit"
                loading={createUserVendorLoading || updateUserVendorLoading}
              >
                {t("buttons.save")}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default CreateOrUpdateUser;