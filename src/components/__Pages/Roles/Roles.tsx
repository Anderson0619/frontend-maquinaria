import { useMutation, useQuery } from "@apollo/client";
import { ButtonTooltipIcon } from "components/_Custom/Button/ButtonTooltipIcon";
import Header from "components/_Custom/Header/Header";
import Icon from "components/_Custom/Icon/Icon";
import Table from "components/_Custom/Table/Table";
import { IColumn } from "components/_Custom/Table/Table.types";
import { useDrawer } from "context/drawer/drawer.provider";
import { useProfile } from "context/profile/profile.context";
import { gqlRole } from "gql";
import { IDeleteRoleInput, IDeleteRoleResponse } from "gql/Role/mutations";
import { IGetRolesResponse } from "gql/Role/queries";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Col, Loader, Row } from "rsuite";
import { IRole } from "types/Role.type";
import CreateOrUpdateRole from "./Forms/CreateOrUpdateRole";

const Roles = () => {
  const { t } = useTranslation("common");
  const { user } = useProfile();
  const { openDrawer } = useDrawer();
  const [selected, setSelected] = useState<string>("");

  const { data, loading } = useQuery<IGetRolesResponse>(
    gqlRole.queries.GET_ALL_ROLES,
    {
      fetchPolicy: "cache-and-network",
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const [deleteRole, { loading: deleteRoleLoading }] = useMutation<
    IDeleteRoleResponse,
    { deleteRoleInput: IDeleteRoleInput }
  >(gqlRole.mutations.DELETE_ROLE, {
    update: (cache, { data }) => {
      if (data) {
        const { deleteRole } = data;
        if (deleteRole) {
          const { getAllRoles } = cache.readQuery<IGetRolesResponse>({
            query: gqlRole.queries.GET_ALL_ROLES,
          });

          if (getAllRoles)
            cache.writeQuery({
              query: gqlRole.queries.GET_ALL_ROLES,
              data: {
                getAllRoles: getAllRoles.filter(
                  (role: IRole) => role.id !== deleteRole.id,
                ),
              },
            });
        }
      }
    },
    onError(e) {
      toast.error(e.message);
    },
  });

  const handleEdit = (role: IRole) => {
    openDrawer({
      drawerComponent: <CreateOrUpdateRole role={role} />,
    });
  };

  const handleDelete = ({ id, name, vendor, routes }: IRole) => {
    try {
      setSelected(id);
      deleteRole({
        variables: { deleteRoleInput: { id } },
        optimisticResponse: {
          deleteRole: {
            id,
            name,
            vendor,
            routes,
          },
        },
      });
    } catch (error) {
      console.error("👀 ~ error", error);
    } finally {
      setSelected("");
      toast.success(t("roles.forms.deleteSuccess"));
    }
  };

  const handleCreateRole = () => {
    openDrawer({
      drawerComponent: <CreateOrUpdateRole />,
    });
  };

  const col: IColumn<IRole>[] = [
    {
      dataKey: "name",
      header: t("tables.name"),
      width: 300,
      customCell: ({ rowData }) => (
        <div className="capitalize">
          <span>{rowData.name}</span>
        </div>
      ),
    },
    {
      dataKey: "id",
      header: t("tables.options"),
      width: 150,
      customCell: ({ rowData }) => (
        <div className="flex space-between">
          <ButtonTooltipIcon
            appearance="primary"
            icon={<Icon icon="edit" />}
            info={t("buttons.edit")}
            showIcon
            placement="topStart"
            trigger="hover"
            className="mr-2"
            onClick={() => {
              handleEdit(rowData);
            }}
            disabled={user.root ? false : !rowData.editable}
          />
          <ButtonTooltipIcon
            appearance="primary"
            color="red"
            icon={<Icon icon="trash" />}
            info={t("buttons.delete")}
            showIcon
            placement="topStart"
            trigger="hover"
            onClick={() => handleDelete(rowData)}
            disabled={!rowData.deletable}
            loading={deleteRoleLoading && rowData.id === selected}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Header
        title={t("roles.headers.title")}
        description={t("roles.headers.description")}
        buttonAction={handleCreateRole}
        buttonLabel={t("roles.headers.buttonLabel")}
        buttonIcon={<Icon icon="circle-plus" className="mr-1" />}
      />
      <Row>
        <Col xs={24}>
          {loading && <Loader vertical />}
          {!loading && data && (
            <Table<IRole> data={data?.getAllRoles} columns={col} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Roles;
