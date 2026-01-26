import { Unvisible, Visible } from "@rsuite/icons";
import React, { useState } from "react";
import { Input, InputGroup, InputProps } from "rsuite";

const PasswordInput = React.forwardRef((props: InputProps, ref) => {
  const [passwordType, setPasswordType] = useState<boolean>(true);

  const handleReveal = () => {
    setPasswordType(!passwordType);
  };
  return (
    <InputGroup inside className="p-0">
      <Input
        ref={ref}
        {...props}
        type={`${passwordType ? "password" : "text"}`}
      />
      <InputGroup.Addon onClick={handleReveal} className="h-full">
        {passwordType && <Unvisible className="text-white m-0 mr-4" />}
        {!passwordType && <Visible className="text-white m-0 mr-4" />}
      </InputGroup.Addon>
    </InputGroup>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
