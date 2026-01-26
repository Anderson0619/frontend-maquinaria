import { useMutation } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { useProfile } from "context/profile/profile.context";
import { gqlRole } from "gql";
import {
  ICreateRoleInput,
  ICreateRoleResponse,
  IUpdateRoleInput,
  IUpdateRoleResponse,
} from "gql/Role/mutations";
import { IGetRolesResponse } from "gql/Role/queries";
import useTranslation from "next-translate/useTranslation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MAIN_MENU_LISTS } from "routes/manager.routes";
import { Button, Col, Input, Row, TagPicker } from "rsuite";
import { NAME_VALIDATION_REGEX } from "settings/constants";
import { IRole } from "types/Role.type";
import { capitalizeFirstLetter } from "utils/string";
import { v4 as uuid } from "uuid";

interface IRoleForm {
  role?: IRole;
}

const CreateOrUpdateRole = ({ role }: IRoleForm) => {
  const { t } = useTranslation("common");
  const { user } = useProfile();
  const { closeDrawer } = useDrawer();
  const tempId: string = uuid();

  const {
    handleSubmit: handleCreateRole,
    control: roleControl,
    formState: { errors },
  } = useForm<ICreateRoleInput>({
    defaultValues: {
      name: role?.name || "",
      routes: role?.routes || [],
    },
  });

  const [createRole, { loading: createRoleLoading }] = useMutation<
    ICreateRoleResponse,
    { createRoleInput: ICreateRoleInput }
  >(gqlRole.mutations.CREATE_ROLE, {
    update: (cache, { data }) => {
      if (data) {
        const { createRole } = data;

        if (createRole) {
          const { getAllRoles } = cache.readQuery<IGetRolesResponse>({
            query: gqlRole.queries.GET_ALL_ROLES,
          });

          if (getAllRoles) {
            cache.writeQuery({
              query: gqlRole.queries.GET_ALL_ROLES,
              data: {
                getAllRoles: [...getAllRoles, createRole],
              },
            });
          }
        }
      }
    },
    onError(e) {
      toast.error(e.message);
    },
  });

  const [updateRole, { loading: updateRoleLoading }] = useMutation<
    IUpdateRoleResponse,
    { updateRoleInput: IUpdateRoleInput }
  >(gqlRole.mutations.UPDATE_ROLE, {
    update: (cache, { data }) => {
      if (data) {
        const { updateRole } = data;

        if (updateRole) {
          const { getAllRoles } = cache.readQuery<IGetRolesResponse>({
            query: gqlRole.queries.GET_ALL_ROLES,
          });

          if (getAllRoles) {
            const patchRoles = getAllRoles.map((r: IRole) =>
              r.id === updateRole.id ? updateRole : r,
            );
            cache.writeQuery({
              query: gqlRole.queries.GET_ALL_ROLES,
              data: {
                getAllRoles: patchRoles,
              },
            });
          }
        }
      }
    },
    onError(e) {
      toast.error(e.message);
    },
  });

  const handleCreateOrUpdate = (data: ICreateRoleInput) => {
    try {
      if (role)
        updateRole({
          variables: { updateRoleInput: { id: role?.id, ...data } },
          optimisticResponse: {
            updateRole: {
              id: role?.id,
              name: data.name,
              routes: data.routes,
              vendor: user.selectedVendor.id,
              createdAt: new Date(),
              deletable: true,
              editable: true,
            },
          },
        });
      else
        createRole({
          variables: { createRoleInput: { id: tempId, ...data } },
          optimisticResponse: {
            createRole: {
              id: tempId,
              name: role?.name || data.name,
              routes: role?.routes || data.routes,
              vendor: user.selectedVendor.id,
              createdAt: new Date(),
              deletable: true,
              editable: true,
            },
          },
        });
    } catch (error) {
      console.error("👀 ~ error", error);
    } finally {
      if (role) toast.success(t("roles.forms.updateSuccess"));
      else toast.success(t("roles.forms.creationSuccess"));

      closeDrawer();
    }
  };

  const routePickerData = [];

  MAIN_MENU_LISTS.forEach((menu) => {
    if (menu.route) {
      routePickerData.push({
        label: capitalizeFirstLetter(menu.displayName),
        value: menu.route,
      });
    }

    // * check if the route has children
    if (menu.childrens.length) {
      menu.childrens.forEach((child) => {
        if (child.route) {
          routePickerData.push({
            label: `${capitalizeFirstLetter(
              menu.displayName,
            )} > ${capitalizeFirstLetter(child.displayName)}`,
            value: child.route,
          });
        }
      });
    }
  });

  return (
    <div className="w-full p-6">
      <Header
        {...{
          title: role
            ? t("roles.forms.updateRoleTitle")
            : t("roles.forms.createRoleTitle"),
          description: role
            ? t("roles.forms.updateRoleDescription")
            : t("roles.forms.createRoleDescription"),
        }}
      />
      <form onSubmit={handleCreateRole(handleCreateOrUpdate)}>
        <Row>
          <Col xs={24}>
            <label>{t("roles.forms.name")}</label>
            <Controller
              name="name"
              defaultValue={role?.name || ""}
              rules={{
                required: true,
                pattern: {
                  value: NAME_VALIDATION_REGEX,
                  message: t("regex.nameValidation"),
                },
              }}
              control={roleControl}
              render={({ field }) => (
                <Input
                  {...field}
                  size="lg"
                  className="w-full mt-2"
                  placeholder={t("roles.forms.namePlaceholder")}
                />
              )}
            />
            {errors && errors.name && errors.name.type !== "pattern" && (
              <small className="w-full text-red-500 mb-2">
                {t("roles.forms.roleRequired")}
              </small>
            )}
            {errors && errors.name && errors.name.type === "pattern" && (
              <small className="w-full text-red-500 mb-2">
                {errors.name.message}
              </small>
            )}
          </Col>
          <Col xs={24} className="mt-2">
            <label>{t("roles.forms.routes")}</label>
            <Controller
              name="routes"
              control={roleControl}
              rules={{ required: true }}
              render={({ field }) => (
                <TagPicker
                  {...field}
                  size="lg"
                  className="w-full"
                  data={routePickerData}
                  labelKey="label"
                  valueKey="value"
                  placeholder={t("roles.forms.routesPlaceholder")}
                />
              )}
            />
            {errors && errors.routes && (
              <small className="w-full text-red-500 mb-2">
                {t("roles.forms.routesRequired")}
              </small>
            )}
          </Col>
          <Col md={24} className="mb-3">
            <div className="flex mt-6 justify-end">
              <Button
                appearance="default"
                className="rs-btn-big"
                onClick={closeDrawer}
                loading={updateRoleLoading}
              >
                <span className="">{t("buttons.cancel")}</span>
              </Button>
              <Button
                appearance="primary"
                className="ml-2 rs-btn-big"
                type="submit"
                loading={createRoleLoading}
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

export default CreateOrUpdateRole;
