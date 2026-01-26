import useTranslation from "next-translate/useTranslation";
import Image from "next/image";

const Offline = () => {
  const { t } = useTranslation("common");

  return (
    <div className="h-screen w-screen flex justify-center items-center p-6">
      <div className="flex flex-col">
        <div className="mb-10 flex flex-col justify-center items-center">
          <Image
            src="/images/svg/icons/no-wifi.svg"
            width={250}
            height={200}
            alt="no-wifi"
          />
          <h3 className="text-2xl font-bold">{t("offline.pageOfflineMsg")}</h3>
        </div>
      </div>
    </div>
  );
};

export default Offline;
