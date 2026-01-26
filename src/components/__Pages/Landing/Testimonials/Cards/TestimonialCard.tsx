import React from "react";
import { Button } from "rsuite";

interface TestimonialCardProps {
  title: string;
  description: string;
}

export const TestimonialCard = ({
  title,
  description,
}: TestimonialCardProps) => (
  <div className="flex flex-col items-center gap-4 w-full rounded-md">
    <div
      className="bg-gray-200 dark:bg-gray-700 flex font-bold items-center justify-center text-2xl w-full rounded-md"
      style={{ height: 200 }}
    >
      Image
    </div>
    <h1 className="text-2xl font-bold text-opacity-75">{title}</h1>
    <p className="text-lg font-medium text-center w-2/4">{description}</p>
    <Button
      appearance="ghost"
      style={{ width: 300 }}
      className="rs-btn-big bg-curent-500 bg-opacity-20"
    >
      <span className="font-bold text-curent-600"> Call to action</span>
    </Button>
  </div>
);
