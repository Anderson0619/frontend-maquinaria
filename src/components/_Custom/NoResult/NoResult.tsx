import useTranslation from "next-translate/useTranslation";
import React from "react";
import Lottie from "react-lottie";
import { Button } from "rsuite";
import lottieNotFound from "utils/lottie/not-found.json";

import { ButtonWrapper, NoResultWrapper } from "./NoResult.style";

type NoResultProps = {
  id?: string;
  onClick?: () => void;
  hideButton?: boolean;
  style?: any;
};

const lottieNotFoundOptions = {
  loop: true,
  autoplay: true,
  isClickToPauseDisabled: true,
  animationData: lottieNotFound,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const NoResult: React.FC<NoResultProps> = ({
  id,
  onClick,
  hideButton = false,
  style,
}) => {
  const { t } = useTranslation("common");

  return (
    <NoResultWrapper id={id} style={style}>
      <Lottie options={lottieNotFoundOptions} height={120} width={120} />

      <h6>{t("tables.notFoundMessage")}</h6>

      {hideButton ? (
        <ButtonWrapper>
          <div onClick={onClick} aria-hidden="true">
            <Button>{t("tables.tryAgainMessage")}</Button>
          </div>
        </ButtonWrapper>
      ) : null}
    </NoResultWrapper>
  );
};

export default NoResult;
