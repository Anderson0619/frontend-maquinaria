import { useEffect, useState } from "react";

const useLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") {
    console.warn(
      `Tried setting localStorage key “${key}” even though environment is not a client`,
    );
  }

  const [value, setValue] = useState(() => {
    let currentValue: any;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue),
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
