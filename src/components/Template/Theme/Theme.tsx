import { EAvailableLanguages } from "components/_Custom/Toggle/ToggleLang/ToggleLang";
import dayjs from "dayjs";
import * as dayjsEn from "dayjs/locale/en";
import * as dayjsEs from "dayjs/locale/es";
import { useTheme } from "next-themes";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { CustomProvider, CustomProviderProps } from "rsuite";
import enUS from "rsuite/locales/en_US";
import esEs from "rsuite/locales/es_ES";
import resolveConfig from "tailwindcss/resolveConfig";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import tailwindConfig from "../../../../tailwind.config.js";

// @ts-ignore
const fullConfig = resolveConfig({ ...tailwindConfig });
export const { theme: tailwindTheme }: TailwindConfig = fullConfig;

const Theme = ({ children }) => {
  const { lang } = useTranslation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (lang === EAvailableLanguages.es) {
      dayjs.locale(dayjsEs);
    } else if (lang === EAvailableLanguages.en) {
      dayjs.locale(dayjsEn);
    }
    if (!theme || theme === "system") {
      setTheme("dark");
    }
  }, [lang]);

  return (
    <CustomProvider
      theme={theme as CustomProviderProps["theme"]}
      locale={lang === EAvailableLanguages.es ? esEs : enUS}
    >
      {children}
    </CustomProvider>
  );
};

export default Theme;
