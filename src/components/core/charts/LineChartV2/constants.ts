// Tooltip configuration constants
export const TOOLTIP_CONFIG = {
  WIDTH: 120,
  HEIGHT: 80,
  MARGIN: 15,
} as const;

// Chart configuration constants
export const CHART_CONFIG = {
  HEIGHT: 300,
  LINE_WIDTH: 1,
  PRICE_SCALE_MARGIN_TOP: 0.01,
  RANGE_STEP_DIVISOR: 4,
  RANGE_PADDING_FACTOR: 0.1,
  VISIBLE_RANGE_OFFSET: 0.5,
} as const;

// Chart layout configuration
export const CHART_LAYOUT_CONFIG = {
  attributionLogo: false,
} as const;

// Crosshair configuration
export const CROSSHAIR_CONFIG = {
  vertLine: {
    visible: false,
    labelVisible: false,
  },
  horzLine: {
    visible: false,
    labelVisible: false,
  },
} as const;

// Grid configuration
export const GRID_CONFIG = {
  vertLines: {
    visible: false,
  },
  horzLines: {
    visible: true,
  },
} as const;

// Price scale configuration
export const PRICE_SCALE_CONFIG = {
  left: {
    visible: true,
    autoScale: false,
    ticksVisible: true,
    ensureEdgeTickMarksVisible: true,
    borderVisible: false,
  },
  right: {
    visible: false,
  },
} as const;

// Time scale configuration
export const TIME_SCALE_CONFIG = {
  visible: true,
  borderVisible: false,
  fixLeftEdge: true,
  fixRightEdge: true,
  ticksVisible: false,
  ignoreWhitespaceIndices: true,
  lockVisibleTimeRangeOnResize: true,
  allowBoldLabels: false,
} as const;

// Chart behavior configuration
export const CHART_BEHAVIOR_CONFIG = {
  handleScroll: false,
  handleScale: false,
  autoSize: true,
} as const;

// Series configuration
export const SERIES_CONFIG = {
  lastValueVisible: false,
  priceLineVisible: false,
} as const;
