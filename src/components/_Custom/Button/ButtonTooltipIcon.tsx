import React, { CSSProperties, ReactElement } from "react";
import {
  Badge,
  Button,
  ButtonProps,
  Tooltip,
  Whisper,
  WhisperProps,
} from "rsuite";

interface IButtonTooltip extends Omit<WhisperProps, "speaker" | "children"> {
  info?: string;
  label?: string;
  showIcon?: boolean;
  inputClassName?: string;
  inputStyle?: CSSProperties;
  loading?: boolean;
  badge?: string | number;
  icon: ReactElement;
  appearance?: ButtonProps["appearance"];
  color?: ButtonProps["color"];
  speaker?: ReactElement;
  children?: ReactElement;
}

export const ButtonTooltipIcon = (props: IButtonTooltip) => {
  const {
    info,
    label,
    className,
    style,
    trigger,
    placement,
    onClick,
    appearance,
    showIcon = false,
    icon,
    color,
    loading = false,
    badge = "",
    disabled = false,
  } = props;

  return (
    <div {...{ className, style }}>
      <Whisper
        trigger={trigger}
        placement={placement}
        speaker={<Tooltip>{info}</Tooltip>}
      >
        {badge ? (
          <Badge content={badge}>
            <Button
              color={color}
              appearance={appearance}
              onClick={onClick}
              loading={loading}
            >
              {label}
              {showIcon && icon}
            </Button>
          </Badge>
        ) : (
          <Button
            color={color}
            appearance={appearance}
            onClick={onClick}
            loading={loading}
            disabled={disabled}
          >
            {label}
            {showIcon && icon}
          </Button>
        )}
      </Whisper>
    </div>
  );
};
