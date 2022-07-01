export const viewports = {
  minMobile: 320,
  maxMobile: 767,
  minTablet: 768,
  maxTablet: 1023,
  minLaptop: 1024,
  maxLaptop: 1279,
  minDesktop: 1280,
  maxDesktop: 1899,
  minDesktopFullHd: 1900,
};

export const screenSize = {
  minMobile: `min-width: ${viewports.minMobile}px`,
  maxMobile: `max-width: ${viewports.maxMobile}px`,
  minTablet: `min-width: ${viewports.minTablet}px`,
  maxTablet: `max-width: ${viewports.maxTablet}px`,
  minLaptop: `min-width: ${viewports.minLaptop}px`,
  maxLaptop: `max-width: ${viewports.maxLaptop}px`,
  minDesktop: `min-width: ${viewports.minDesktop}px`,
  maxDesktop: `max-width: ${viewports.maxDesktop}px`,
  minDesktopFullHd: `min-width: ${viewports.minDesktopFullHd}`,
};
