import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";

import Backdrop from "./Backdrop";
import Pane from "./Pane";
import { getTranslateValue } from "./utils";
/**
 * Animated left-to-right side pane with a backdrop.
 *
 * @param {string} appNodeId - DOM node id that contains the application (for aria-hidden)
 * @param {string} aria-describedby
 * @param {string} aria-label
 * @param {string} aria-labelledby
 * @param {boolean} autoWidth - Will take the width bounding box's width of the
 * SidePane's child instead of width
 * @param {string} backdropClassName - Classname to pass to the backdrop
 * @param {object} backdropStyle - Style object to pass to the backdrop
 * @param children - One React element or a function that can hold the onActive callback
 * @param {string} className - Classname to pass to the pane
 * @param {string} containerId - DOM node id where the side panes will portal to.
 * Will be passed to document.getElementById. Default: document.body.
 * @param {boolean} disableBackdropClick - Prevents click on backdrop to trigger onClose
 * @param {boolean} disableEscapeKeyDown - Prevents Escape key down to trigger onClose.
 * Recommended: Should not be disabled as it is part of a11y specs
 * @param {boolean} disableRestoreFocus - Prevents restoring focus on previous active element
 * after pane is closed. Recommended: Should not be disabled as it is part of a11y specs
 * @param {number} duration - Animation dur. (ms). Aniamtions are diabled when reduce-motion is on
 * @param {boolean} hideBackdrop - Makes the backdrop transparent
 * @param {number} offset - Space (width in %) between parent and child when both are open
 * @param {boolean} open - Whether to display the pane
 * @param {object} style - Style object to pass to the pane
 * @param {number} width - Width of the pane in percentage. Max: 100.
 * @callback onActive - Callback from child to parent to pass on the child width on open
 * @callback onClose - Callback triggered on Escape or click on backdrop
 */

const ariaHideContainer = (containerId, value) => {
  const container = document.getElementById(containerId);
  if (!container || container.getAttribute("aria-hidden") === value) {
    return;
  }
  container.setAttribute("aria-hidden", value);
};

interface ISidePaneProps {
  appNodeId?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  autoWidth?: boolean;
  backdropClassName?: string;
  // eslint-disable-next-line react/forbid-prop-types
  backdropStyle?: object;
  children: any;
  className?: string;
  containerId?: string;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  disableRestoreFocus?: boolean;
  duration?: number;
  hideBackdrop?: boolean;
  offset?: number;
  onActive?: (value: any) => void;
  onClose: () => void;
  open: boolean;
  // eslint-disable-next-line react/forbid-prop-types
  style?: React.CSSProperties;
  width?: number;
}

const SidePane = (props: ISidePaneProps) => {
  const {
    appNodeId = "root",
    "aria-describedby": ariaDescribedBy = "",
    "aria-label": ariaLabel = "side pane",
    "aria-labelledby": ariaLabelledby = "",
    autoWidth = false,
    backdropClassName = "",
    backdropStyle = {},
    children,
    className = "",
    containerId = "",
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    disableRestoreFocus = false,
    duration = 250,
    hideBackdrop = false,
    offset = 10,
    onActive = null,
    onClose,
    open = false,
    style = {},
    width = 0,
  } = props;
  const ref = useRef(null);
  const paneRef = useRef(null);
  const paneContentRef = useRef(null);
  const actualWidth = useRef(width);
  const translateRef = useRef(
    getTranslateValue(actualWidth.current, 0, offset),
  );
  const [active, setActive] = useState(false);
  const DOMContainer = useMemo(
    () => (containerId ? document.getElementById(containerId) : document.body),
    [containerId],
  );

  useEffect(() => {
    const { current } = ref;
    const handleEscape = ({ code, key, keyCode }) => {
      const keyValue = code || key || keyCode;
      const isEscape = ["Escape", "Esc", 27].some(
        (value) => value === keyValue,
      );
      if (isEscape && typeof onClose === "function") {
        onClose();
      }
    };
    if (!disableEscapeKeyDown && active) {
      current?.addEventListener("keydown", handleEscape);
    }
    return () => {
      current?.removeEventListener("keydown", handleEscape);
    };
  }, [active, disableEscapeKeyDown, onClose]);

  useEffect(() => {
    const { current } = ref;
    const isActive = open || active;
    if (isActive) {
      disableBodyScroll(current, { allowTouchMove: () => true });
    } else {
      enableBodyScroll(current);
    }
  }, [open, active]);

  const updateTranslateValue = useCallback(
    (newTranslateValue) => {
      translateRef.current = newTranslateValue;
      paneRef.current.style.transform = `translateX(+100%) translateX(-${newTranslateValue}vw)`;
      if (typeof onActive === "function") {
        onActive(newTranslateValue);
      }
    },
    [onActive],
  );
  const handleActive = useCallback(
    (childTranslateValue) => {
      ariaHideContainer(appNodeId, "true");
      ref.current?.setAttribute(
        "aria-hidden",
        (!!childTranslateValue).toString(),
      );
      updateTranslateValue(
        getTranslateValue(actualWidth.current, childTranslateValue, offset),
      );
    },
    [appNodeId, offset, updateTranslateValue],
  );
  const handleEnter = () => {
    ariaHideContainer(appNodeId, "true");
    ref.current.focus();
    setActive(true);
  };
  const handleExited = () => setActive(false);
  const handleEntered = () => {
    if (autoWidth) {
      const w = paneContentRef.current
        ? paneContentRef.current.getBoundingClientRect().width
        : 0;
      const wP = (w / document.body.clientWidth) * 100;
      actualWidth.current = wP;
    } else {
      actualWidth.current = width;
    }
    updateTranslateValue(getTranslateValue(actualWidth.current, 0, offset));
  };
  const handleExiting = () => {
    if (typeof onActive === "function") {
      onActive(0);
    } else {
      ariaHideContainer(appNodeId, "false");
    }
  };
  const getContentPaneProps = () => {
    const props = {
      onActive: handleActive,
      ref: null,
    };
    if (autoWidth) {
      props.ref = paneContentRef;
    }
    return props;
  };

  const isActive = open || active;
  const paneContentProps = getContentPaneProps();

  return createPortal(
    <FocusLock
      autoFocus
      disabled={!isActive}
      returnFocus={!disableRestoreFocus}
      shards={[ref.current]}
      whiteList={(node) => DOMContainer.contains(node)}
    >
      <div
        ref={ref}
        className={isActive ? "sidePane" : ""}
        data-open={isActive}
        tabIndex={-1}
      >
        <Backdrop
          className={backdropClassName || ""}
          disableBackdropClick={disableBackdropClick}
          duration={duration}
          hideBackdrop={hideBackdrop}
          style={backdropStyle || {}}
          onClose={onClose}
        >
          <Pane
            ref={paneRef}
            ariaDescribedBy={ariaDescribedBy}
            ariaLabel={ariaLabel}
            ariaLabelledby={ariaLabelledby}
            autoWidth={autoWidth}
            className={className || ""}
            duration={duration}
            open={open}
            style={style || {}}
            translateValue={translateRef.current}
            width={width}
            onEnter={handleEnter}
            onEntered={handleEntered}
            onExited={handleExited}
            onExiting={handleExiting}
          >
            {active &&
              (typeof children === "function"
                ? children({ onActive: handleActive })
                : React.cloneElement(
                    React.Children.only(children),
                    paneContentProps,
                  ))}
          </Pane>
        </Backdrop>
      </div>
    </FocusLock>,
    DOMContainer,
  );
};

export default SidePane;
