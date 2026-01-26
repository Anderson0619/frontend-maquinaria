import React from "react";
import { Col, Row } from "rsuite";

import { TestimonialCard } from "./Cards/TestimonialCard";

export const Testimonials = () => (
  <div className="py-12 container mx-auto px-3">
    <div className="flex flex-col items-center gap-2 bg-white dark:bg-black">
      <h2 className="text-3xl font-bold  text-opacity-75 text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </h2>
      <p className="text-lg text-center">
        ed eros ante, facilisis accumsan vehicula eu, laoreet sed lacus.
        Curabitur a molestie arcu.
      </p>
    </div>
    <Row className="mt-6">
      <Col xs={24} md={12} lg={8} className="mb-12">
        <TestimonialCard
          title="Lorem ipsum dolor sit amet"
          description="el nisl vitae placerat. Donec eget turpis aliquam, rutrum ligula nec,
          tristique"
        />
      </Col>
      <Col xs={24} md={12} lg={8} className="mb-12">
        <TestimonialCard
          title="Lorem ipsum dolor sit amet"
          description="el nisl vitae placerat. Donec eget turpis aliquam, rutrum ligula nec,
          tristique"
        />
      </Col>
      <Col xs={24} md={12} lg={8} className="mb-12">
        <TestimonialCard
          title="Lorem ipsum dolor sit amet"
          description="el nisl vitae placerat. Donec eget turpis aliquam, rutrum ligula nec,
          tristique"
        />
      </Col>
    </Row>
  </div>
);
