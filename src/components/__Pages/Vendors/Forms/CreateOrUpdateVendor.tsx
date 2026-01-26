import { useMutation } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useDrawer } from "context/drawer/drawer.provider";
import { gqlVendor } from "gql";
import {
  ICreateVendorInput,
  ICreateVendorResponse,
  ICreateVendorUserInput,
  IUpdateVendorInput,
  IUpdateVendorResponse,
} from "gql/Vendor/mutations";
import { IGetVendorsResponse } from "gql/Vendor/queries";
import useTranslation from "next-translate/useTranslation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Col, Input, Row } from "rsuite";
import { IVendor } from "types/Vendor.types";
import { v4 as uuid } from "uuid";

interface ICreateOrUpdateVendorProps {
  vendor?: IVendor;
  vendors?: IVendor[];
}

const CreateOrUpdateVendor = ({
  vendor,
  vendors,
}: ICreateOrUpdateVendorProps) => {
  const { closeDrawer } = useDrawer();
  const { t } = useTranslation("common");
  const tempId: string = uuid();

  const [createUserVendor, { loading: createVendorLoading }] = useMutation<
    ICreateVendorResponse,
    { createVendorInput: ICreateVendorInput }
  >(gqlVendor.mutations.CREATE_VENDOR, {
    update: (cache, { data }) => {
      if (data) {
        const { createVendor } = data;
        if (createVendor) {
          const { vendors } = cache.readQuery<IGetVendorsResponse>({
            query: gqlVendor.queries.VENDORS,
          });

          if (vendors)
            cache.writeQuery({
              query: gqlVendor.queries.VENDORS,
              data: {
                vendors: [...vendors, createVendor],
              },
            });
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateVendor, { loading: updateVendorLoading }] = useMutation<
    IUpdateVendorResponse,
    { updateVendorInput: IUpdateVendorInput }
  >(gqlVendor.mutations.UPDATE_VENDOR, {
    update: (cache, { data }) => {
      if (data) {
        const { updateVendor } = data;
        if (updateVendor) {
          const { vendors } = cache.readQuery<{ vendors: IVendor[] }>({
            query: gqlVendor.queries.VENDORS,
          });

          if (vendors)
            cache.writeQuery({
              query: gqlVendor.queries.VENDORS,
              data: {
                vendors: vendors.map((vendor) =>
                  vendor.id === updateVendor.id ? updateVendor : vendor,
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
  } = useForm<ICreateVendorInput>({
    defaultValues: {
      name: vendor?.name || "",
    },
  });

  const handleCreateOrUpdateVendor = (data: ICreateVendorUserInput) => {
    try {
      // * check if email already exists in users
      const vendorExists = vendors?.find((user) => user.name === data.name);

      if (vendorExists) {
        toast.error(t("vendors.vendorExists"));
        return;
      }

      if (vendor) {
        updateVendor({
          variables: {
            updateVendorInput: {
              id: vendor.id,
              ...data,
            },
          },
          optimisticResponse: {
            updateVendor: {
              id: vendor.id,
              name: data.name,
              slug: data.name.toLowerCase().replace(/ /g, "-"),
            },
          },
        });
      } else {
        createUserVendor({
          variables: {
            createVendorInput: {
              ...data,
            },
          },
          optimisticResponse: {
            createVendor: {
              id: tempId,
              name: data.name,
              createdAt: new Date(),
              slug: data.name.toLowerCase().replace(/ /g, "-"),
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
    }

    if (vendor) toast.success(t("vendors.forms.updateSuccess"));
    else toast.success(t("vendors.forms.creationSuccess"));
    closeDrawer();
  };

  return (
    <div className="p-6">
      <Header
        title={
          vendor
            ? t("vendors.forms.updateTitle")
            : t("vendors.forms.createTitle")
        }
      />

      <form onSubmit={handleSubmit(handleCreateOrUpdateVendor)}>
        <Row>
          <Col xs={24}>
            <label className="font-bold">{t("vendors.name")}</label>
            <Controller
              name="name"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t("vendors.name")} />
              )}
            />
            {errors?.name && (
              <span className="text-red-500">
                {t("register.nameQuestionError")}
              </span>
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
                loading={createVendorLoading || updateVendorLoading}
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

export default CreateOrUpdateVendor;
