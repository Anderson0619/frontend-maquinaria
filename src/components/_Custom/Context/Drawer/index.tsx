import { Close } from "@rsuite/icons";
import React from "react";
import { Drawer, DrawerProps } from "rsuite";

interface IDrawerProps extends DrawerProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
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

const AdminDrawer: React.FC<IDrawerProps> = ({
  isOpen,
  onRequestClose,
  children,
  ...drawerProps
}) => (
  <Drawer open={isOpen} onClose={onRequestClose} {...drawerProps}>
    <button type="button" onClick={onRequestClose} style={{ ...buttonStyle }}>
      <Close />
    </button>
    <div className="p-5 w-100">{children}</div>
  </Drawer>
);

export default AdminDrawer;
