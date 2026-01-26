import Icon from "components/_Custom/Icon/Icon";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { Button, ButtonProps, Placeholder } from "rsuite";

import PopupInfo from "../PopupInfo/PopupInfo";
import { HeaderDescription, HeaderWrapper } from "./Header.style";

export interface HeaderProps {
  title: string;
  description?: string;
  popupInfo?: string;
  buttonLabel?: string;
  buttonAction?: () => void;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  buttonColor?: ButtonProps["color"];
  buttonIcon?: ReactElement;
  secondButtonLabel?: string;
  secondButtonAction?: () => void;
  secondButtonLoading?: boolean;
  secondButtonColor?: ButtonProps["color"];
  secondButtonIcon?: ReactElement;
  thirdButtonLabel?: string;
  thirdButtonAction?: () => void;
  thirdButtonLoading?: boolean;
  thirdButtonColor?: ButtonProps["color"];
  thirdButtonIcon?: ReactElement;
  className?: string;
  enableBack?: boolean;
  loading?: boolean;
  titleSize?: string;
  element?: ReactElement;
  descriptionSize?: string;
}
const Header = (props: HeaderProps) => {
  const router = useRouter();
  const {
    title,
    description,
    popupInfo,
    buttonLabel,
    buttonDisabled,
    buttonAction,
    buttonColor,
    buttonLoading = false,
    secondButtonLabel,
    secondButtonAction,
    secondButtonColor,
    secondButtonLoading = false,
    thirdButtonLabel,
    thirdButtonAction,
    thirdButtonColor,
    thirdButtonLoading = false,
    className = "",
    enableBack,
    loading = false,
    titleSize = "text-2xl",
    element,
    buttonIcon,
    secondButtonIcon,
    thirdButtonIcon,
    descriptionSize = "12px",
  } = props;

  return (
    <div className="flex flex-col md:flex-row mb-3 max-w-full">
      <div className={`${element ? "w-full md:w-1/2" : "w-full"}`}>
        <HeaderWrapper className={`pb-5 ${className}`}>
          {loading ? (
            <Placeholder.Paragraph style={{ marginTop: 30 }} />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex relative items-center">
                  {enableBack && (
                    <Icon
                      icon="chevron-left"
                      onClick={() => router.back()}
                      className="mr-3 hover:text-current-500 cursor-pointer"
                    />
                  )}
                  <span className={`${titleSize} font-bold select-none`}>
                    {title}
                  </span>
                  {popupInfo && (
                    <PopupInfo
                      className="self-center ml-2"
                      label={popupInfo}
                      placement="bottomEnd"
                    />
                  )}
                </div>
                <div className="flex gap-3 mr-10">
                  {buttonLabel && (
                    <Button
                      appearance="primary"
                      onClick={buttonAction}
                      loading={buttonLoading}
                      color={buttonColor}
                      disabled={!!buttonDisabled}
                    >
                      {buttonIcon && buttonIcon}
                      {buttonLabel}
                    </Button>
                  )}
                  {secondButtonLabel && (
                    <Button
                      appearance="primary"
                      onClick={secondButtonAction}
                      loading={secondButtonLoading}
                      color={secondButtonColor}
                    >
                      {secondButtonIcon && secondButtonIcon}
                      {secondButtonLabel}
                    </Button>
                  )}
                  {thirdButtonLabel && (
                    <Button
                      appearance="primary"
                      onClick={thirdButtonAction}
                      loading={thirdButtonLoading}
                      color={thirdButtonColor}
                    >
                      {thirdButtonIcon && thirdButtonIcon}
                      {thirdButtonLabel}
                    </Button>
                  )}
                </div>
              </div>
              <HeaderDescription
                className="select-none self-start"
                style={{ fontSize: descriptionSize }}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </>
          )}
        </HeaderWrapper>
      </div>
      {element && (
        <div className="flex-1">
          <div>{element}</div>
        </div>
      )}
    </div>
  );
};
export default Header;
