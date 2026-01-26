import { Footer } from "components/__Pages/Landing/Footer/Footer";
import React, { FC } from "react";

const LandingLayout: FC = (props) => {
  const { children } = props;

  return (
    <div className="h-full w-full min-h-screen">
      {children}
      <Footer />
    </div>
  );
};

export default LandingLayout;
