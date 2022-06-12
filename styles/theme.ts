import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    dark: "#039700",
    darker: "#054d03",
    light: "#45B649",
    text: "#026000",
  },
};

const fonts = {
  body: `'Poppins', sans-serif`,
};

const theme = extendTheme({ config, colors, fonts });

export default theme;
