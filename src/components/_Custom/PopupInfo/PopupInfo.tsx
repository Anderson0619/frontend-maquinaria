import React, { CSSProperties, ReactElement } from "react";
import { Tooltip, Whisper, WhisperProps } from "rsuite";

import Icon from "../Icon/Icon";

interface IPopupInfo extends Omit<WhisperProps, "children" | "speaker"> {
  label?: string;
  inputClassName?: string;
  inputStyle?: CSSProperties;
  className: string;
  children?: ReactElement;
  speaker?: ReactElement;
}

const PopupInfo = (props: IPopupInfo, ref) => {
  const { label, style, className, trigger, placement } = props;

  return (
    <div {...{ className, style, ref }}>
      <Whisper
        trigger={trigger}
        placement={placement}
        controlId={`control-id-${placement}`}
        speaker={<Tooltip>{label}</Tooltip>}
      >
        <div className="cursor-pointer hover:text-current-500">
          <Icon icon="question-circle" className="text-gray-500" />
        </div>
      </Whisper>
    </div>
  );
};

export default PopupInfo;
