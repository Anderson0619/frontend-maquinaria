import Icon from "components/_Custom/Icon/Icon";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "rsuite";

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <Button appearance="ghost" onClick={toggleTheme}>
      <>
        {theme === "dark" && (
          <>
            <span className="mr-2">Light Mode</span>
            <Icon
              icon="sun"
              className="text-curent-500 hover:text-current-300 animate__animated animate__zoomIn "
              size="lg"
            />
          </>
        )}
        {theme === "light" && (
          <>
            <span className="mr-2">Dark Mode</span>
            <Icon
              icon="moon"
              className="text-curent-500 hover:text-current-300 animate__animated animate__zoomIn"
              size="lg"
            />{" "}
          </>
        )}
      </>
    </Button>
  );
};
export default ToggleTheme;
