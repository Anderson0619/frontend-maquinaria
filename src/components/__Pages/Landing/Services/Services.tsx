import React from "react";
import { Col, Row } from "rsuite";

import { ServiceCard } from "./Cards/ServiceCard";

export const Services = () => (
  <div className="bg-white dark:bg-black pt-12 pb-16 container mx-auto">
    <div className="flex flex-col items-center justify-center gap-2 p-6">
      <span className="text-3xl font-bold text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </span>
      <p className="text-lg text-center">
        ed eros ante, facilisis accumsan vehicula eu, laoreet sed lacus.
        Curabitur a molestie arcu.
      </p>
    </div>
    <Row className="mt-12">
      <Col xs={24} md={12} lg={8} className="mb-12">
        <ServiceCard
          icon="/images/svg/icons/services/recycling.svg"
          title="Nullam lacinia justo"
          description="Vestibulum sagittis mollis leo et vestibulum. Curabitur auctor felis
          quis felis ullamcorper"
        />
      </Col>
      <Col xs={24} md={12} lg={8} className="mb-12">
        <ServiceCard
          icon="/images/svg/icons/services/bottle.svg"
          title="Nullam lacinia justo"
          description="Vestibulum sagittis mollis leo et vestibulum. Curabitur auctor felis
          quis felis ullamcorper"
        />
      </Col>
      <Col xs={24} md={12} lg={8} className="mb-12">
        <ServiceCard
          icon="/images/svg/icons/services/trash.svg"
          title="Nullam lacinia justo"
          description="Vestibulum sagittis mollis leo et vestibulum. Curabitur auctor felis
          quis felis ullamcorper"
        />
      </Col>
    </Row>
  </div>
);
