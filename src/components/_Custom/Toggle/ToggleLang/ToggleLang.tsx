import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";
import { SelectPicker } from "rsuite";
import { TypeAttributes } from "rsuite/esm/@types/common";
import { USER_LANG } from "settings/constants";

export enum EAvailableLanguages {
  es = "es",
  en = "en",
}
interface IAvailableLenguages {
  value: EAvailableLanguages;
  label: string;
}
export const availableLanguages: IAvailableLenguages[] = [
  { value: EAvailableLanguages.es, label: "Español" },
  { value: EAvailableLanguages.en, label: "English" },
];

interface IToggleLang {
  placement?: TypeAttributes.Placement;
}

const ToggleLang = ({ placement }: IToggleLang) => {
  const { lang } = useTranslation("common");

  const currentLang = localStorage.getItem(USER_LANG);

  if (currentLang !== lang) {
    localStorage.setItem(USER_LANG, lang);
  }

  const changeLanguage = (lang: EAvailableLanguages) => {
    localStorage.setItem(USER_LANG, lang);
    setLanguage(lang);
  };
  return (
    <>
      {lang && (
        <SelectPicker
          data={availableLanguages}
          style={{ width: 120 }}
          defaultValue={lang}
          onChange={changeLanguage}
          cleanable={false}
          searchable={false}
          placement={placement || "bottom"}
        />
      )}
    </>
  );
};

export default ToggleLang;
