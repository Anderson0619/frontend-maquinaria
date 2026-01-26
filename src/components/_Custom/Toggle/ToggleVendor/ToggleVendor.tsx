import { useMutation } from "@apollo/client";
import { useProfile } from "context/profile/profile.context";
import { gqlUser } from "gql";
import { IUpdateUserSelectedVendorInput } from "gql/User/mutations";
import React from "react";
import { SelectPicker } from "rsuite";

const ToggleVendor = () => {
  const [updateUserSelectedVendor] = useMutation<{
    updateUserSelectedVendor: IUpdateUserSelectedVendorInput;
  }>(gqlUser.mutations.UPDATE_USER_SELECTED_VENDOR);

  const { user } = useProfile();

  const handleOnChangeVendor = async (data) => {
    if (data !== localStorage.getItem("selectedVendorId")) {
      await updateUserSelectedVendor({
        variables: {
          updateUserSelectedVendorInput: { vendor: data },
        },
      });

      localStorage.setItem("selectedVendorId", data);
      window.location.reload();
    }
  };

  return (
    <>
      {user?.vendorList?.length > 1 && (
        <SelectPicker
          className="mr-2"
          data={user?.vendorList}
          labelKey="name"
          valueKey="id"
          cleanable={false}
          searchable={false}
          onChange={handleOnChangeVendor}
          style={{ width: 150 }}
          defaultValue={user?.selectedVendor?.id || ""}
          placeholder="Seleccione"
        />
      )}
    </>
  );
};

export default ToggleVendor;
