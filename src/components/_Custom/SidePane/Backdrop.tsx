import { ReactElement, useRef } from "react";

import { getOpacityTransition } from "./utils";

interface IBackDropProps {
  children: ReactElement;
  className: string;
  disableBackdropClick: boolean;
  duration: number;
  hideBackdrop: boolean;
  onClose: () => void;
  style: React.CSSProperties;
}
const Backdrop = (props: IBackDropProps) => {
  const {
    children,
    className,
    disableBackdropClick,
    duration,
    hideBackdrop,
    onClose,
    style,
  } = props;

  const backdropRef = useRef(null);
  const handleClick = ({ target }) => {
    const { current } = backdropRef;
    if (disableBackdropClick || target !== current) {
      return;
    }
    onClose();
  };
  return (
    <div
      ref={backdropRef}
      aria-label="backdrop"
      className={`sidePane__backdrop ${className}`}
      data-disable-backdrop={disableBackdropClick}
      data-hide-backdrop={hideBackdrop}
      role="presentation"
      style={{
        ...getOpacityTransition(duration),
        ...style,
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default Backdrop;
