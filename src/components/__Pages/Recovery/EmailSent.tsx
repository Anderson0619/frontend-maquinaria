import Header from "components/_Custom/Header/Header";
import React from "react";

interface EmailSentProps {
  email: string;
  name: string;
}
export const EmailSent = (props: EmailSentProps) => {
  const { email, name } = props;
  return (
    <div className="w-full p-5">
      <Header
        {...{
          title: `¡${name} Te hemos enviado un e-mail!`,
          description: `Hemos enviado un correo electrónico a ${email} con un enlace para recuperar tu contraseña`,
        }}
      />
    </div>
  );
};
