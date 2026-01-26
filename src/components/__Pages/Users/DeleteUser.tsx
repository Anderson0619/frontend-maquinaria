import { useMutation } from "@apollo/client";
import Header from "components/_Custom/Header/Header";
import { useModal } from "context/modal/modal.provider";
import { gqlVendor } from "gql";
import {
  IDeleteUserVendorInput,
  IDeleteUserVendorResponse,
} from "gql/Vendor/mutations";
import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";
import { Button } from "rsuite";
import { IUser } from "types/User.types";

interface IDeleteUserProps {
  user: IUser;
}

const DeleteUser = ({ user }: IDeleteUserProps) => {
  const { t } = useTranslation("common");
  const { closeModal } = useModal();

  const [deleteUser, { loading: deleteUserloading }] = useMutation<
    IDeleteUserVendorResponse,
    { deleteVendorUserInput: IDeleteUserVendorInput }
  >(gqlVendor.mutations.DELETE_USER_VENDOR, {
    update: (cache, { data }) => {
      if (data) {
        const { deleteVendorUser } = data;
        if (deleteVendorUser) {
          const { vendorUsers } = cache.readQuery<{ vendorUsers: IUser[] }>({
            query: gqlVendor.queries.VENDOR_USERS,
          });

          if (vendorUsers)
            cache.writeQuery({
              query: gqlVendor.queries.VENDOR_USERS,
              data: {
                vendorUsers: vendorUsers.filter(
                  (vendorUser) => vendorUser.id !== deleteVendorUser.id,
                ),
              },
            });
        }
      }
    },
    onError: () => {
      toast.error(
        t("users.forms.deleteError", {
          name: user.name,
          lastname: user.lastname,
        }),
      );
    },
  });

  const handleDeleteUser = () => {
    try {
      deleteUser({
        variables: {
          deleteVendorUserInput: { id: user.id },
        },
        optimisticResponse: {
          deleteVendorUser: {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      toast.success(t("users.forms.deleteSuccess"));
      closeModal();
    }
  };

  return (
    <div className="p-6">
      <Header title={t("users.headers.delete.title")} />
      <label className="font-bold">
        {t("users.forms.deleteMessage", {
          name: user.name,
          lastname: user.lastname,
        })}
      </label>

      <Button
        appearance="primary"
        className="mt-6 w-full"
        onClick={handleDeleteUser}
        loading={deleteUserloading}
      >
        {t("users.buttons.delete")}
      </Button>
    </div>
  );
};

export default DeleteUser;
