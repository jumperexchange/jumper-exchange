import { baseColors } from './baseColors';
import { brandColors } from './brandColors';

export const paletteDark = {
  ...baseColors,
  // primary and secondary colors need to be added
  primary: brandColors.dark.accent1,
  secondary: brandColors.dark.accent2,

  // Accent
  accent1: brandColors.dark.accent1,
  accent1Alt: brandColors.dark.accent1Alt,
  accent2: brandColors.dark.accent2,
  accent2Alt: brandColors.dark.accent2Alt,

  // Surface
  surface1: brandColors.dark.surface1,
  surface2: brandColors.dark.surface2,
  surface3: brandColors.dark.surface3,
  surface4: brandColors.dark.surface4,
  surface1Hover: baseColors.alphaLight100.main,
  surface1ActiveAccent: brandColors.dark.surfaceActiveAccent,
  surface1Active: baseColors.alphaLight200.main,
  surfaceStark: baseColors.alphaLight900.main,
  surfaceAccent1: brandColors.dark.accent1Alt,
  surfaceAccent1Bg: brandColors.dark.surfaceActiveAccent,
  surfaceAccent1Fg: brandColors.dark.accent1Alt,
  surfaceAccent2: brandColors.dark.accent2,
  surfaceAccent2Bg: brandColors.dark.accent2,
  surfaceAccent2Fg: brandColors.dark.accent2,
  surfaceSystem1: baseColors.grey[800],
  surfaceSystem2: baseColors.grey[900],

  // Alpha
  alpha100: baseColors.alphaLight100,
  alpha200: baseColors.alphaLight200,
  alpha300: baseColors.alphaLight300,
  alpha400: baseColors.alphaLight400,
  alpha500: baseColors.alphaLight500,
  alpha600: baseColors.alphaLight600,
  alpha700: baseColors.alphaLight700,
  alpha800: baseColors.alphaLight800,
  alpha900: baseColors.alphaLight900,

  // Text
  textPrimaryEmphasized: baseColors.white.main,
  textPrimary: baseColors.alphaLight900.main,
  textPrimaryInverted: baseColors.alphaDark900.main,

  textSecondary: baseColors.alphaLight700.main,
  textSecondaryInverted: baseColors.alphaDark700.main,

  textTertiary: baseColors.alphaLight400.main,

  textAccent1: brandColors.dark.accent1,
  textAccent2: brandColors.dark.accent2,

  textHint: baseColors.alphaLight600.main,

  textEmphasized: baseColors.white.main,

  textError: baseColors.scarlet[500],
  textDisabled: baseColors.alphaLight400.main,
  textInfo: baseColors.azure[500],

  // Background
  bg: baseColors.lavenderDark[300],
  bgLighter: baseColors.lavenderDark[300],
  bgDarker: baseColors.lavenderDark[400],
  bgGlow1: brandColors.dark.accent1Alt,
  bgGlow2: brandColors.dark.accent1Alt,
  bgGlow3: brandColors.dark.accent1Alt,

  // Border
  border: baseColors.alphaLight200.main,
  borderInverted: baseColors.alphaDark200.main,
  borderEmphasized: baseColors.alphaLight600.main,
  borderInvertedEmphasized: baseColors.alphaDark600.main,
  borderActive: baseColors.orchid[600],
  borderError: baseColors.scarlet[500],

  // Button
  buttonPrimaryBg: brandColors.dark.accent1,
  buttonPrimaryAction: baseColors.lavenderLight[0],

  buttonSecondaryBg: baseColors.lavenderDark[0],
  buttonSecondaryAction: baseColors.lavenderLight[0],

  buttonAlphaLightBg: baseColors.alphaLight900.main,
  buttonAlphaLightAction: baseColors.alphaLight100.main,

  buttonAlphaDarkBg: baseColors.alphaLight900.main,
  buttonAlphaDarkAction: baseColors.alphaLight100.main,

  buttonDisabledBg: baseColors.alphaLight100.main,
  buttonDisabledAction: baseColors.alphaLight500.main,

  buttonLightBg: baseColors.white.main,
  buttonLightAction: baseColors.black.main,

  buttonActiveBg: baseColors.white.main,
  buttonActiveAction: baseColors.black.main,

  buttonErrorBg: baseColors.scarlet[500],

  // Badge
  badgeAccent1Fg: baseColors.white.main,
  badgeAccent1Bg: brandColors.dark.accent1,

  badgeAccent1MutedFg: brandColors.dark.accent1,
  badgeAccent1MutedBg: brandColors.dark.accent1Alt,

  badgeAlphaFg: baseColors.alphaLight900.main,
  badgeAlphaBg: baseColors.alphaLight100.main,

  badgeDefaultFg: baseColors.alphaLight900.main,
  badgeDefaultBg: brandColors.dark.surface2,

  badgeDisabledFg: baseColors.alphaLight500.main,
  badgeDisabledBg: baseColors.alphaLight100.main,

  badgeLightFg: baseColors.black.main,
  badgeLightBg: baseColors.white.main,

  // Link
  linkPrimary: baseColors.lavenderDark[0],
  linkSecondary: baseColors.lavenderDark[0],
  linkAlpha: baseColors.alphaLight900.main,
  linkAlphaDeemphasized: baseColors.alphaLight600.main,
  linkDisabled: baseColors.alphaLight400.main,

  // Logo
  logoPrimary: brandColors.dark.accent1,
  logoSecondary: brandColors.dark.accent2,

  // Icon
  iconEmphasized: baseColors.white.main,
  iconEmphasizedInverted: baseColors.black.main,
  iconPrimary: baseColors.alphaLight900.main,
  iconPrimaryInverted: baseColors.alphaDark900.main,
  iconSecondary: baseColors.alphaLight700.main,
  iconSecondaryInverted: baseColors.alphaDark700.main,
  iconHint: baseColors.alphaLight500.main,
  iconDisabled: baseColors.alphaLight400.main,
  iconError: baseColors.scarlet[500],
  iconInfo: baseColors.azure[500],
  iconWarning: baseColors.amber[500],
  iconAccent1: brandColors.dark.accent1,
  iconAccent1Alt: brandColors.dark.accent1Alt,
  iconAccent2: brandColors.dark.accent2,

  // Status
  statusInfo: baseColors.azure[400],
  statusInfoFg: baseColors.azure[400],
  statusInfoBg: baseColors.azure[800],
  statusPending: baseColors.alphaLight200.main,
  statusProgress: brandColors.dark.accent1,
  statusSuccess: baseColors.mint[100],
  statusSuccessFg: baseColors.mint[100],
  statusSuccessBg: baseColors.mint[500],
  statusWarning: baseColors.amber[600],
  statusWarningFg: baseColors.amber[600],
  statusWarningBg: baseColors.amber[800],
  statusError: baseColors.scarlet[100],
  statusErrorFg: baseColors.scarlet[100],
  statusErrorBg: baseColors.scarlet[500],
};
