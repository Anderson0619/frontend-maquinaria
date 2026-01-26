import chroma from "chroma-js";

export const generateSitePalette = (primaryColor: string) => {
  const lightTheme = Array.from(
    document.getElementsByClassName(
      "rs-theme-light",
    ) as HTMLCollectionOf<HTMLElement>,
  ).at(0);

  const darkTheme = Array.from(
    document.getElementsByClassName(
      "rs-theme-dark",
    ) as HTMLCollectionOf<HTMLElement>,
  ).at(0);

  lightTheme?.style.setProperty("--rs-primary", primaryColor);
  darkTheme?.style.setProperty("--rs-primary", primaryColor);

  const generatePalette = (hue500: string, prefix: string) => {
    const white = chroma
      .scale(["white", hue500.replace("#", "")])
      .domain([0, 1])
      .mode("lrgb")
      .colors(50)[1];

    const black = chroma
      .scale(["black", hue500.replace("#", "")])
      .domain([0, 1])
      .mode("lrgb")
      .colors(10)[1];

    const inputs = {
      0: white,
      50: "",
      100: "",
      200: "",
      300: "",
      400: "",
      500: hue500,
      600: "",
      700: "",
      800: "",
      900: "",
      1000: black,
    };

    // Create the colors array from the inputs
    // eslint-disable-next-line
    const colors = Object.entries(inputs).map(([_, color]) => {
      if (!chroma.valid(color)) {
        return undefined;
      }
      return color;
    });

    // Clone the colors and remove the white and black
    // so only the user provided values are left
    const userColors = [...colors];
    userColors.shift();
    userColors.pop();

    // Build the domain array
    const domain = [
      0,
      ...(() => {
        const map = [];
        userColors.forEach((color, index) => {
          if (color !== undefined) {
            if (index === 0) {
              map.push(50);
            } else {
              map.push(index * 100);
            }
          }
        });
        return map;
      })(),
      1000,
    ];

    // Generate the color scale
    const scale = chroma
      .scale(colors.filter((color) => color !== undefined))
      .domain(domain)
      .mode("lrgb");

    // Build the palette
    const palette = [
      scale(0).hex(),
      scale(50).hex(),
      scale(100).hex(),
      scale(200).hex(),
      scale(300).hex(),
      scale(400).hex(),
      scale(500).hex(),
      scale(600).hex(),
      scale(700).hex(),
      scale(800).hex(),
      scale(900).hex(),
      scale(1000).hex(),
    ];

    Object.keys(inputs).forEach((value, index) => {
      lightTheme?.style.setProperty(`${prefix}-${value}`, palette[index]);
      darkTheme?.style.setProperty(`${prefix}-${value}`, palette[index]);
    });
  };

  // Generate for primary color
  generatePalette(primaryColor, "--rs-primary");

  // Generate for gray color
  generatePalette("#404159", "--rs-gray");
};
