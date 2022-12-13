const Fonts = `
  @font-face {
    font-family: "GalanoGrotesque";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: local("GalanoGrotesque"), local("GalanoGrotesque-Bold"),
      url("/GalanoGrotesqueBold.woff2") format("woff2");
    unicoderange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF;
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100;
    font-display: swap;
    src: url("/Inter-Thin.woff2?v=3.19") format("woff2"),
      url("/Inter-Thin.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 100;
    font-display: swap;
    src: url("/Inter-ThinItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-ThinItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 200;
    font-display: swap;
    src: url("/Inter-ExtraLight.woff2?v=3.19") format("woff2"),
      url("/Inter-ExtraLight.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 200;
    font-display: swap;
    src: url("/Inter-ExtraLightItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-ExtraLightItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: url("/Inter-Light.woff2?v=3.19") format("woff2"),
      url("/Inter-Light.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 300;
    font-display: swap;
    src: url("/Inter-LightItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-LightItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("/Inter-Regular.woff2?v=3.19") format("woff2"),
      url("/Inter-Regular.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url("/Inter-Italic.woff2?v=3.19") format("woff2"),
      url("/Inter-Italic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url("/Inter-Medium.woff2?v=3.19") format("woff2"),
      url("/Inter-Medium.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 500;
    font-display: swap;
    src: url("/Inter-MediumItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-MediumItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url("/Inter-SemiBold.woff2?v=3.19") format("woff2"),
      url("/Inter-SemiBold.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 600;
    font-display: swap;
    src: url("/Inter-SemiBoldItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-SemiBoldItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url("/Inter-Bold.woff2?v=3.19") format("woff2"),
      url("/Inter-Bold.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 700;
    font-display: swap;
    src: url("/Inter-BoldItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-BoldItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 800;
    font-display: swap;
    src: url("/Inter-ExtraBold.woff2?v=3.19") format("woff2"),
      url("/Inter-ExtraBold.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 800;
    font-display: swap;
    src: url("/Inter-ExtraBoldItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-ExtraBoldItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: url("/Inter-Black.woff2?v=3.19") format("woff2"),
      url("/Inter-Black.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: Inter;
    font-style: italic;
    font-weight: 900;
    font-display: swap;
    src: url("/Inter-BlackItalic.woff2?v=3.19") format("woff2"),
      url("/Inter-BlackItalic.woff?v=3.19") format("woff");
  }

  /* -------------------------------------------------------
Variable font.
Usage:

  hml { ont-family: 'Inter', sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }
*/
  @font-face {
    font-family: "Inter var";
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
    font-named-instance: "Regular";
    src: url("/Inter-roman.var.woff2?v=3.19") format("woff2");
  }

  @font-face {
    font-family: "Inter var";
    font-weight: 100 900;
    font-display: swap;
    font-style: italic;
    font-named-instance: "Italic";
    src: url("/Inter-italic.var.woff2?v=3.19") format("woff2");
  }
`;

export default Fonts;
