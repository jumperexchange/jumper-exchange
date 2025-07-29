import { baseColors } from './baseColors';
import { brandColors } from './brandColors';

export const paletteLight = {
  ...baseColors,
  // primary and secondary colors need to be added
  primary: brandColors.light.accent1,
  secondary: brandColors.light.accent2,

  // Accent
  accent1: brandColors.light.accent1,
  accent1Alt: brandColors.light.accent1Alt,
  accent2: brandColors.light.accent2,
  accent2Alt: brandColors.light.accent2Alt,

  // Surface
  surface1: brandColors.light.surface1,
  surface2: brandColors.light.surface2,
  surface3: brandColors.light.surface3,
  surface4: brandColors.light.surface4,
  surface1Hover: baseColors.alphaDark100.main,
  surface1ActiveAccent: brandColors.light.surfaceActiveAccent,
  surface1Active: brandColors.light.surfaceActive.main,
  surfaceStark: baseColors.alphaDark900.main,
  surfaceAccent1: baseColors.lavenderLight[100],
  surfaceAccent1Bg: baseColors.lavenderLight[100],
  surfaceAccent1Fg: baseColors.lavenderDark[0],
  surfaceAccent2: baseColors.orchid[800],
  surfaceAccent2Bg: baseColors.orchid[200],
  surfaceAccent2Fg: baseColors.orchid[800],
  surfaceSystem1: baseColors.grey[100],
  surfaceSystem2: baseColors.grey[300],

  // Alpha
  alpha100: baseColors.alphaDark100,
  alpha200: baseColors.alphaDark200,
  alpha300: baseColors.alphaDark300,
  alpha400: baseColors.alphaDark400,
  alpha500: baseColors.alphaDark500,
  alpha600: baseColors.alphaDark600,
  alpha700: baseColors.alphaDark700,
  alpha800: baseColors.alphaDark800,
  alpha900: baseColors.alphaDark900,

  // Text
  textPrimaryEmphasized: baseColors.black.main,
  textPrimary: baseColors.alphaDark900.main,
  textPrimaryInverted: baseColors.alphaLight900.main,

  textSecondary: baseColors.alphaDark700.main,
  textSecondaryInverted: baseColors.alphaLight700.main,

  textTertiary: baseColors.alphaDark400.main,

  textAccent1: brandColors.light.accent1,
  textAccent2: brandColors.light.accent2,

  textHint: baseColors.alphaDark600.main,

  textEmphasized: baseColors.black.main,

  textError: baseColors.scarlet[500],
  textDisabled: baseColors.alphaDark400.main,
  textInfo: baseColors.azure[500],

  // Background
  bg: baseColors.lavenderLight[200],
  // bgLighter: baseColors.lavenderLight[50]
  bgDarker: baseColors.lavenderLight[400],
  bgGlow1: `rgba(136, 0, 255, 0.12)`,
  bgGlow2: `rgba(187, 0, 255, 0.12)`,
  bgGlow3: `rgba(0, 68, 255, 0.12)`,

  // Border

  border: brandColors.light.border.main,
  borderInverted: baseColors.alphaLight200.main,
  borderEmphasized: baseColors.alphaDark600.main,
  borderInvertedEmphasized: baseColors.alphaLight600.main,
  borderActive: baseColors.orchid[400],
  borderError: baseColors.scarlet[500],

  // Button
  buttonPrimaryBg: baseColors.lavenderDark[0],
  buttonPrimaryAction: baseColors.lavenderLight[0],

  buttonSecondaryBg: baseColors.lavenderLight[400],
  buttonSecondaryAction: baseColors.lavenderDark[100],

  buttonAlphaLightBg: baseColors.alphaLight600.main,
  buttonAlphaLightAction: baseColors.alphaDark900.main,

  buttonAlphaDarkBg: baseColors.alphaDark100.main,
  buttonAlphaDarkAction: baseColors.alphaDark900.main,

  buttonDisabledBg: baseColors.alphaDark100.main,
  buttonDisabledAction: baseColors.alphaDark500.main,

  buttonLightBg: baseColors.white.main,
  buttonLightAction: baseColors.black.main,

  buttonActiveBg: baseColors.white.main,
  buttonActiveAction: baseColors.black.main,

  buttonErrorBg: baseColors.scarlet[500],

  // Badge
  badgeAccent1Fg: baseColors.white.main,
  badgeAccent1Bg: brandColors.light.accent1,

  badgeAccent1MutedFg: baseColors.lavenderDark[0],
  badgeAccent1MutedBg: baseColors.lavenderLight[400],

  badgeAlphaFg: baseColors.alphaDark900.main,
  badgeAlphaBg: baseColors.alphaDark100.main,

  badgeDefaultFg: baseColors.alphaDark900.main,
  badgeDefaultBg: brandColors.light.surface2,

  badgeDisabledFg: baseColors.alphaDark500.main,
  badgeDisabledBg: baseColors.alphaDark100.main,

  badgeLightFg: baseColors.black.main,
  badgeLightBg: baseColors.white.main,

  // Link
  linkPrimary: baseColors.lavenderDark[0],
  linkSecondary: baseColors.lavenderDark[0],
  linkAlpha: baseColors.alphaDark900.main,
  linkAlphaDeemphasized: baseColors.alphaDark600.main,
  linkDisabled: baseColors.alphaDark400.main,

  // Logo
  logoPrimary: brandColors.light.accent1,
  logoSecondary: brandColors.light.accent2,

  // Icon
  iconEmphasized: baseColors.black.main,
  iconEmphasizedInverted: baseColors.white.main,
  iconPrimary: baseColors.alphaDark900.main,
  iconPrimaryInverted: baseColors.alphaLight900.main,
  iconSecondary: baseColors.alphaDark700.main,
  iconSecondaryInverted: baseColors.alphaDark700.main,
  iconHint: baseColors.alphaDark500.main,
  iconDisabled: baseColors.alphaDark400.main,
  iconError: baseColors.scarlet[500],
  iconInfo: baseColors.azure[500],
  iconWarning: baseColors.amber[500],
  iconAccent1: brandColors.light.accent1,
  iconAccent1Alt: brandColors.light.accent1Alt,
  iconAccent2: brandColors.light.accent2,

  // Status
  statusInfo: baseColors.azure[500],
  statusInfoFg: baseColors.azure[500],
  statusInfoBg: baseColors.azure[100],
  statusPending: baseColors.alphaDark200.main,
  statusProgress: brandColors.light.accent1,
  statusSuccess: baseColors.mint[500],
  statusSuccessFg: baseColors.mint[500],
  statusSuccessBg: baseColors.mint[100],
  statusWarning: baseColors.amber[500],
  statusWarningFg: baseColors.amber[500],
  statusWarningBg: baseColors.amber[100],
  statusError: baseColors.scarlet[500],
  statusErrorFg: baseColors.scarlet[500],
  statusErrorBg: baseColors.scarlet[100],
};
