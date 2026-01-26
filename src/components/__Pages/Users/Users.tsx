import { useQuery } from "@apollo/client";
import { ButtonTooltipIcon } from "components/_Custom/Button/ButtonTooltipIcon";
import Header from "components/_Custom/Header/Header";
import Icon from "components/_Custom/Icon/Icon";
import Table from "components/_Custom/Table/Table";
import { IColumn } from "components/_Custom/Table/Table.types";
import DeleteUser from "components/__Pages/Users/DeleteUser";
import { useDrawer } from "context/drawer/drawer.provider";
import { useModal } from "context/modal/modal.provider";
import { gqlVendor } from "gql";
import useTranslation from "next-translate/useTranslation";
import { Col, Loader, Row } from "rsuite";
import { IUser } from "types/User.types";
import CreateOrUpdateUser from "./Forms/CreateOrUpdateUser";

const Users = () => {
  const { openDrawer } = useDrawer();

  const handleNewUser = () => {
    openDrawer({
      drawerComponent: <CreateOrUpdateUser />,
    });
  };

  const { openModal } = useModal();
  const { t } = useTranslation("common");

  const { data: vendorUsersData, loading: vendorUsersLoading } = useQuery<{
    vendorUsers: IUser[];
  }>(gqlVendor.queries.VENDOR_USERS, {
    nextFetchPolicy: "cache-and-network",
  });

  const handleDeleteUser = (user: IUser) => {
    openModal({
      backdrop: "static",
      modalComponent: <DeleteUser user={user} />,
      size: "xs",
    });
  };

  const handleEditUser = (user: IUser) => {
    openDrawer({
      drawerComponent: <CreateOrUpdateUser user={user} />,
    });
  };

  const columns: IColumn<IUser>[] = [
    {
      dataKey: "name",
      header: t("users.name"),
      sortable: true,
      width: 120,
    },
    {
      dataKey: "lastname",
      header: t("users.lastname"),
      sortable: true,
      width: 120,
    },
    {
      dataKey: "email",
      header: t("users.email"),
      sortable: true,
      width: 300,
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
              handleEditUser(rowData);
            }}
          />
          <ButtonTooltipIcon
            appearance="primary"
            color="red"
            icon={<Icon icon="trash" />}
            info={t("buttons.delete")}
            showIcon
            placement="topStart"
            trigger="hover"
            onClick={() => handleDeleteUser(rowData)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Header
        title={t("users.headers.title")}
        description={t("users.headers.description")}
        buttonAction={handleNewUser}
        buttonLabel={t("users.headers.buttonLabel")}
        buttonIcon={<Icon icon="circle-plus" className="mr-1" />}
      />
      <Row>
        <Col xs={24} className="mb-5">
          {vendorUsersLoading && <Loader vertical />}
          {!vendorUsersLoading && (
            <Table<IUser>
              data={vendorUsersData?.vendorUsers}
              columns={columns}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Users;
