import Header from "components/_Custom/Header/Header";
import ToggleLang from "components/_Custom/Toggle/ToggleLang/ToggleLang";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { Col, Row } from "rsuite";

const HomePage = () => {
  const { t } = useTranslation("common");
  return (
    <Row>
      <Col xs={24}>
        <Header title={t("home.title")} description={t("home.description")} />
      </Col>
      <Col md={24} className="mb-5 flex items-center gap-3">
        <span className="block font-bold text-2xl">Next Translate</span>{" "}
        <ToggleLang placement="bottom" />
      </Col>
    </Row>
  );
};

export default HomePage;
