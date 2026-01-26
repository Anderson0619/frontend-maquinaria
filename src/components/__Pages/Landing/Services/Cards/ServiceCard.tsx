import Image from "next/image";
import React from "react";

interface IServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

export const ServiceCard = ({
  icon,
  title,
  description,
}: IServiceCardProps) => (
  <div className="flex flex-col items-center gap-4">
    <Image src={icon} width={100} height={50} alt="icon" />
    <h1 className="text-2xl font-bold text-current-700">{title}</h1>
    <p className="text-lg font-medium  text-center w-2/4">{description}</p>
  </div>
);
