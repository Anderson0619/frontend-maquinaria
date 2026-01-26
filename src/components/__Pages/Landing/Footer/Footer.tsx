import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
import { LOGO_DARK, LOGO_LIGHT } from "settings/constants";

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <div className="bottom-0 w-full bg-gray-100 dark:bg-gray-900">
      <div className="pt-12 w-full flex flex-col text-center pb-12">
        <div>
          <Image
            src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
            width={300}
            height={50}
            alt="logo"
          />
        </div>

        <p>SISTEMA DE MAQUINARIA</p>
        <span>Manta - Manabí - Ecuador</span>
      </div>

      <div className=" w-full text-center text-gray-400 p-6 border-t border-gray-300 dark:border-gray-800">
        <span>Copyright @ Tu página de destino 2026 Sistema de Maquinaria</span>
      </div>
    </div>
  );
};
