import { createTheme } from "@mui/material/styles";
import { viewports, bodyStyled, resetStyled } from "@transferto/shared/style/";
import React from "react";
import Fonts from "../fonts/fonts";

declare module "@mui/material/styles" {
  interface Palette {
    brandPrimary: Palette["primary"];
    brandPrimaryTint100: Palette["primary"];
    brandSecondary: Palette["primary"];
    brandTertiary: Palette["primary"];
    grey: Palette["grey"];
    systemSuccess: Palette["primary"];
    systemWarning: Palette["primary"];
    systemError: Palette["primary"];
  }
  interface PaletteOptions {
    brandPrimary?: PaletteOptions["primary"];
    brandPrimaryTint100?: PaletteOptions["primary"];
    brandSecondary?: PaletteOptions["primary"];
    brandTertiary?: PaletteOptions["primary"];
    grey?: PaletteOptions["grey"];
    systemSuccess?: PaletteOptions["primary"];
    systemWarning?: PaletteOptions["primary"];
    systemError?: PaletteOptions["primary"];
  }
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
    desktopFullHD: true;
  }

  interface TypographyVariants {
    hero: React.CSSProperties;
    subtitleL: React.CSSProperties;
    subtitleM: React.CSSProperties;
    subtitleS: React.CSSProperties;
    buttonL: React.CSSProperties;
    buttonM: React.CSSProperties;
    captionM: React.CSSProperties;
    captionS: React.CSSProperties;
    bodyRegularL: React.CSSProperties;
    bodyRegularM: React.CSSProperties;
    bodyRegularS: React.CSSProperties;
    bodyRegularXS: React.CSSProperties;
    bodyRegularXXS: React.CSSProperties;
    bodyMediumL: React.CSSProperties;
    bodyMediumM: React.CSSProperties;
    bodyMediumS: React.CSSProperties;
    bodyMediumXS: React.CSSProperties;
    bodyMediumXXS: React.CSSProperties;
    bodyBoldL: React.CSSProperties;
    bodyBoldM: React.CSSProperties;
    bodyBoldS: React.CSSProperties;
    bodyBoldXS: React.CSSProperties;
    bodyBoldXXS: React.CSSProperties;
    bodyLinkL: React.CSSProperties;
    bodyLinkM: React.CSSProperties;
    bodyLinkS: React.CSSProperties;
    bodyLinkXS: React.CSSProperties;
    bodyLinkXXS: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    hero?: React.CSSProperties;
    subtitleL?: React.CSSProperties;
    subtitleM?: React.CSSProperties;
    subtitleS?: React.CSSProperties;
    buttonL?: React.CSSProperties;
    buttonM?: React.CSSProperties;
    captionM?: React.CSSProperties;
    captionS?: React.CSSProperties;
    bodyRegularL?: React.CSSProperties;
    bodyRegularM?: React.CSSProperties;
    bodyRegularS?: React.CSSProperties;
    bodyRegularXS?: React.CSSProperties;
    bodyRegularXXS?: React.CSSProperties;
    bodyMediumL?: React.CSSProperties;
    bodyMediumM?: React.CSSProperties;
    bodyMediumS?: React.CSSProperties;
    bodyMediumXS?: React.CSSProperties;
    bodyMediumXXS?: React.CSSProperties;
    bodyBoldL?: React.CSSProperties;
    bodyBoldM?: React.CSSProperties;
    bodyBoldS?: React.CSSProperties;
    bodyBoldXS?: React.CSSProperties;
    bodyBoldXXS?: React.CSSProperties;
    bodyLinkL?: React.CSSProperties;
    bodyLinkM?: React.CSSProperties;
    bodyLinkS?: React.CSSProperties;
    bodyLinkXS?: React.CSSProperties;
    bodyLinkXXS?: React.CSSProperties;
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    brandPrimary: true;
    brandPrimaryTint100: true;
    brandSecondary: true;
    brandTertiary: true;
    grey: true;
    systemSuccess: true;
    systemWarning: true;
    systemError: true;
    inherit: false;
    primary: false;
    secondary: false;
    success: false;
    error: false;
    info: false;
    warning: false;
  }
}
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    hero: true;
    subtitleL: true;
    subtitleM: true;
    subtitleS: true;
    buttonL: true;
    buttonM: true;
    captionM: true;
    captionS: true;
    bodyRegularL: true;
    bodyRegularM: true;
    bodyRegularS: true;
    bodyRegularXS: true;
    bodyRegularXXS: true;
    bodyMediumL: true;
    bodyMediumM: true;
    bodyMediumS: true;
    bodyMediumXS: true;
    bodyMediumXXS: true;
    bodyBoldL: true;
    bodyBoldM: true;
    bodyBoldS: true;
    bodyBoldXS: true;
    bodyBoldXXS: true;
    bodyLinkL: true;
    bodyLinkM: true;
    bodyLinkS: true;
    bodyLinkXS: true;
    bodyLinkXXS: true;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    button: false;
    caption: false;
  }
}

const themePresets = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          hero: "div",
          h1: "h2",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
          subtitleL: "div",
          subtitleM: "div",
          subtitleS: "div",
          buttonL: "button",
          buttonM: "button",
          captionM: "p",
          captionS: "p",
          bodyRegularL: "p",
          bodyRegularM: "p",
          bodyRegularS: "p",
          bodyRegularXS: "p",
          bodyRegularXXS: "p",
          bodyMediumL: "p",
          bodyMediumM: "p",
          bodyMediumS: "p",
          bodyMediumXS: "p",
          bodyMediumXXS: "p",
          bodyBoldL: "p",
          bodyBoldM: "p",
          bodyBoldS: "p",
          bodyBoldXS: "p",
          bodyBoldXXS: "p",
          bodyLinkL: "a",
          bodyLinkM: "a",
          bodyLinkS: "a",
          bodyLinkXS: "a",
          bodyLinkXXS: "a",
        },
      },
    },
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: viewports.minTablet,
      laptop: viewports.minLaptop,
      desktop: viewports.minDesktop,
      desktopFullHD: viewports.minDesktopFullHd,
    },
  },
});

export const theme = createTheme({
  ...themePresets,
  spacing: 4,
  palette: {
    brandPrimary: {
      light: "#13F287",
      main: "#13F287",
      dark: "#13F287",
    },
    brandPrimaryTint100: {
      light: "#93FFCB",
      main: "#93FFCB",
      dark: "#93FFCB",
      contrastText: "#fff",
    },
    brandSecondary: {
      light: "#FF6C3E",
      main: "#FF6C3E",
      dark: "#FF6C3E",
      contrastText: "#000",
    },
    brandTertiary: {
      light: "#633DFF",
      main: "#633DFF",
      dark: "#633DFF",
      contrastText: "#000",
    },
    grey: {
      100: "#FFFFFF",
      200: "#D9DADD",
      300: "#B3B5BB",
      400: "#838690",
      500: "#61646D",
      600: "#414348",
      700: "#303135",
      800: "#1C1D20",
      900: "#000000",
    },
    systemSuccess: {
      main: "#02C55B",
      light: "#02C55B",
      dark: "#02C55B",
    },
    systemWarning: {
      main: "#FFF95F",
      light: "#FFF95F",
      dark: "#FFF95F",
    },
    systemError: {
      main: "#E4294B",
      light: "#E4294B",
      dark: "#E4294B",
    },
  },
  typography: {
    fontFamily: ['"Inter"', "Arial", "sans-serif"].join(","),
    hero: {
      fontFamily: "GalanoGrotesque, Arial",
      fontSize: 50,
      lineHeight: "58px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 76,
        lineHeight: "84px",
        fontWeight: 400,
        letterSpacing: -1,
      },
    },
    h1: {
      fontFamily: "GalanoGrotesque, serif",
      fontSize: 42,
      lineHeight: "50px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 68,
        lineHeight: "74px",
        fontWeight: 600,
      },
    },
    h2: {
      fontFamily: "Inter, monospace",
      fontSize: 36,
      lineHeight: "44px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 54,
        lineHeight: "64px",
        fontWeight: 600,
      },
    },
    h3: {
      fontSize: 32,
      lineHeight: "42px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 48,
        lineHeight: "70px",
        fontWeight: 400,
      },
    },
    h4: {
      fontSize: 27,
      lineHeight: "36px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 32,
        lineHeight: "40px",
        fontWeight: 400,
      },
    },
    h5: {
      fontSize: 22,
      lineHeight: "30px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 24,
        lineHeight: "34px",
        fontWeight: 400,
      },
    },
    h6: {
      fontSize: 20,
      lineHeight: "26px",
      fontWeight: 700,
      [themePresets.breakpoints.up("tablet")]: {
        fontSize: 20,
        lineHeight: "28px",
        fontWeight: 400,
      },
    },
    subtitleL: {
      fontFamily: "Inter",
      fontSize: 22,
      lineHeight: "42px",
      fontWeight: 300,
      letterSpacing: 0.4,
    },
    subtitleM: {
      fontSize: 20,
      lineHeight: "36px",
      fontWeight: 400,
      letterSpacing: 0.6,
    },
    subtitleS: {
      fontSize: 18,
      lineHeight: "34px",
      fontWeight: 300,
      letterSpacing: 0.2,
    },
    buttonM: {
      fontFamily: "Inter",
      fontSize: 15,
      lineHeight: "20px",
      fontWeight: 500,
    },
    buttonL: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: "20px",
      fontWeight: 500,
    },
    captionM: {
      fontFamily: "Roboto Mono",
      fontSize: 14,
      lineHeight: "16px",
      fontWeight: 400,
    },
    captionS: {
      fontFamily: "Roboto Mono",
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 400,
    },
    bodyRegularL: {
      fontFamily: "Inter",
      fontSize: 17,
      lineHeight: "28px",
      fontWeight: 400,
    },
    bodyRegularM: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: "28px",
      fontWeight: 400,
      letterSpacing: 0.2,
    },
    bodyRegularS: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: "22px",
      fontWeight: 400,
      letterSpacing: 0.2,
    },
    bodyRegularXS: {
      fontFamily: "Inter",
      fontSize: 13,
      lineHeight: "20px",
      fontWeight: 400,
      letterSpacing: -0.1,
    },
    bodyRegularXXS: {
      fontFamily: "Inter",
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 400,
      letterSpacing: -0.1,
    },
    bodyMediumL: {
      fontFamily: "Inter",
      fontSize: 17,
      lineHeight: "28px",
      fontWeight: 500,
    },
    bodyMediumM: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: "28px",
      fontWeight: 500,
      letterSpacing: 0.2,
    },
    bodyMediumS: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: "22px",
      fontWeight: 500,
    },
    bodyMediumXS: {
      fontFamily: "Inter",
      fontSize: 13,
      lineHeight: "20px",
      fontWeight: 500,
      letterSpacing: -0.1,
    },
    bodyMediumXXS: {
      fontFamily: "Inter",
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 500,
      letterSpacing: -0.1,
    },
    bodyBoldL: {
      fontFamily: "Inter",
      fontSize: 17,
      lineHeight: "28px",
      fontWeight: 700,
    },
    bodyBoldM: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: "28px",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    bodyBoldS: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: "22px",
      fontWeight: 700,
    },
    bodyBoldXS: {
      fontFamily: "Inter",
      fontSize: 13,
      lineHeight: "20px",
      fontWeight: 700,
    },
    bodyBoldXXS: {
      fontFamily: "Inter",
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 700,
    },
    bodyLinkL: {
      fontFamily: "Inter",
      fontSize: 17,
      lineHeight: "28px",
      fontWeight: 400,
    },
    bodyLinkM: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: "28px",
      fontWeight: 400,
    },
    bodyLinkS: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: "22px",
      fontWeight: 400,
    },
    bodyLinkXS: {
      fontFamily: "Inter",
      fontSize: 13,
      lineHeight: "20px",
      fontWeight: 400,
      letterSpacing: -0.1,
    },
    bodyLinkXXS: {
      fontFamily: "Inter",
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 400,
      letterSpacing: -0.1,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `${resetStyled} ${bodyStyled} ${Fonts}`,
    },
  },
});
