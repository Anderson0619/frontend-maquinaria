import { useMutation, useQuery } from "@apollo/client";
import { ButtonTooltipIcon } from "components/_Custom/Button/ButtonTooltipIcon";
import Header from "components/_Custom/Header/Header";
import Icon from "components/_Custom/Icon/Icon";
import Table from "components/_Custom/Table/Table";
import { IColumn } from "components/_Custom/Table/Table.types";
import { useDrawer } from "context/drawer/drawer.provider";
import { useProfile } from "context/profile/profile.context";
import { gqlVendor } from "gql";
import { IGetVendorsResponse } from "gql/Vendor/queries";
import moment from "moment";
import useTranslation from "next-translate/useTranslation";
import { Col, Loader, Row } from "rsuite";
import { IVendor } from "types/Vendor.types";
import { IDeleteUserVendorResponse, IDeleteUserVendorInput } from "gql/Vendor/mutations";
import CreateOrUpdateVendor from "./Forms/CreateOrUpdateVendor";

const Vendors = () => {
  const { t } = useTranslation("common");
  const { user } = useProfile();

  const { data: vendorsData, loading: vendorsLoading } =
    useQuery<IGetVendorsResponse>(gqlVendor.queries.VENDORS, {
      nextFetchPolicy: "cache-and-network",
    });
  
  const [deleteVendor, { loading: deleteVendorLoading }] = useMutation<
    IDeleteUserVendorResponse, { deleteUserVendorInput: IDeleteUserVendorInput }
  >(gqlVendor.mutations.DELETE_USER_VENDOR, {
    update: (cache, { data }) => {
      if (data) {
        const { deleteVendorUser } = data;

        if (deleteVendorUser) {
          const { vendors } = cache.readQuery<{ vendors: IVendor[] }>({
            query: gqlVendor.queries.VENDORS
          })

          if (vendors) {
            cache.writeQuery({
              query: gqlVendor.queries.VENDORS,
              data: {
                vendors: vendors.filter(vendor => vendor.id !== deleteVendorUser.id)
              }
            })
          }
        }
      }
    },
    onError: (error) => {
      alert(error.message)
    }
  })

  const handleDeleteVendor = (id: string) => {
    try {
      deleteVendor({
        variables: {
          deleteUserVendorInput: { id }
        }
      })
    } catch (error) {
      alert(error)
    }
  }

  const { openDrawer } = useDrawer();

  const handleCreateVendor = () => {
    openDrawer({
      drawerComponent: <CreateOrUpdateVendor vendors={vendorsData?.vendors} />,
    });
  };

  const handleEditVendor = (vendor: IVendor) => {
    openDrawer({
      drawerComponent: (
        <CreateOrUpdateVendor vendor={vendor} vendors={vendorsData?.vendors} />
      ),
    });
  };

  const columns: IColumn<IVendor>[] = [
    {
      dataKey: "name",
      header: t("vendors.name"),
      sortable: true,
      width: 150,
    },
    {
      dataKey: "createdAt",
      header: t("vendors.createdAt"),
      sortable: true,
      width: 150,
      customCell: ({ rowData }) => (
        <div>{moment(rowData.createdAt).format("DD-MM-YYYY")}</div>
      ),
    },
  ];

  if (user?.root) {
    columns.push({
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
              handleEditVendor(rowData);
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
            loading={deleteVendorLoading}
            onClick={() => {handleDeleteVendor(rowData.id)}}
          />
        </div>
      ),
    });
  }

  return (
    <div className="p-3">
      <Header
        title={t("vendors.headers.title")}
        description={t("vendors.headers.description")}
        buttonAction={handleCreateVendor}
        buttonLabel={user?.root && t("vendors.headers.buttonLabel")}
        buttonIcon={<Icon icon="circle-plus" className="mr-1" />}
      />
      <Row>
        <Col xs={24} className="mb-5">
          {vendorsLoading && <Loader vertical />}
          {!vendorsLoading && (
            <Table<IVendor> data={vendorsData?.vendors} columns={columns} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Vendors;
