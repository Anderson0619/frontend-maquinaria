import { Close } from "@rsuite/icons";
import React, { CSSProperties } from "react";
import { Modal, ModalProps } from "rsuite";

interface IModalProps extends ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  style?: CSSProperties;
}

const buttonStyle = {
  width: 35,
  height: 35,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ffffff",
  color: "#0D1136",
  border: 0,
  outline: 0,
  boxShadow: "none",
  borderRadius: "50%",
  position: "fixed" as "fixed",
  top: "20px",
  right: "35px",
  zIndex: 100000,
  cursor: "pointer",

  ":focus": {
    outline: 0,
    boxShadow: "none",
  },
};

const CenterModal: React.FC<IModalProps> = (props) => {
  const { isOpen, onRequestClose, children, ...modalProps } = props;

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      style={{ padding: 0 }}
      className="fodtureModal"
      {...modalProps}
    >
      <button type="button" onClick={onRequestClose} style={{ ...buttonStyle }}>
        <Close />
      </button>
      {children}
    </Modal>
  );
};

export default CenterModal;
