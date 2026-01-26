import { IconName } from "@fortawesome/fontawesome-svg-core";
import { VALID_URL_REGEX } from "settings/constants";

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

export const numberWithDots = (str: string): string =>
  str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const capitalizeFirstLetter = (string: string): string =>
  `${string.charAt(0).toUpperCase()}${string.toLowerCase().slice(1)}`;

export const removeAccents = (str: string): string =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const compareIcon = (percent: number): IconName => {
  const percentType =
    percent < 0 ? "arrow-down" : percent === 0 ? "equals" : "arrow-up";

  return percentType;
};

export const percentColor = (percent: number) => {
  const percentType =
    percent < 30
      ? "#F87171"
      : percent >= 30 && percent < 90
      ? "#FFAC3D"
      : "#34D399";

  return percentType;
};

export const percentIcon = (percent: number): IconName => {
  const percentType =
    percent < 30
      ? "arrow-down"
      : percent >= 30 && percent < 90
      ? "equals"
      : "arrow-up";

  return percentType;
};

export const isUUID = (uuid: string): boolean => {
  const s = `${uuid}`;
  const test = s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
  );

  if (test === null) {
    return false;
  }
  return true;
};

export const firstChars = (str: string): string => {
  const words = str.split(" ");
  let chars = "";

  words.forEach((w) => {
    chars += w[0];
  });

  return chars;
};

export type Color =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "violet";

// * random color
export const randomColor = (word: string) => {
  const posibleColors = [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "violet",
  ];

  // * get random color based on word length
  return posibleColors[word.length % posibleColors.length] as Color;
};

export const colorByBackground = (bgColor: string) => {
  let cleanBgColor = bgColor;
  // If a leading # is provided, remove it
  if (cleanBgColor.slice(0, 1) === "#") {
    cleanBgColor = cleanBgColor.slice(1);
  }

  // Convert to RGB value
  const r = parseInt(cleanBgColor.substr(0, 2), 16);
  const g = parseInt(cleanBgColor.substr(2, 2), 16);
  const b = parseInt(cleanBgColor.substr(4, 2), 16);

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "#000000" : "#ffffff";
};

export const checkIsEmptyParagraph = (paragraph: string) => {
  const data = paragraph
    .replace(/<[^>]*>/gi, " ")
    .replace(/<\/[^>]*>/gi, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/gi, " ")
    .trim();

  return data.length === 0;
};

export const isUrl = (str: string): boolean => {
  if (!str || str.length === 0) return false;
  const urlRegex = VALID_URL_REGEX;
  const url = new RegExp(urlRegex, "i");
  return str.length < 2083 && url.test(str);
};

export const getQsParams = <TURLParams extends {}>(): TURLParams => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlSearchParams.entries()) as TURLParams;
};

export const getRandomUsername = (): string =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 2,
    separator: "-",
    style: "lowerCase",
  });
