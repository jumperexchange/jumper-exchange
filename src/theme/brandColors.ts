import { baseColors } from './baseColors';

export interface BrandColors {
  light: {
    // Surfaces
    surface1: string;
    surface2: string;
    surface3: string;
    surface4: string;
    surfaceActiveAccent: string;
    surfaceActive: { main: string };

    // Accents
    accent1: string;
    accent1Alt: string;
    accent2: string;
    accent2Alt: string;

    // Border
    borderAccent1: string;
    border: { main: string };

    // --------------------------------------------------
    // UI Component Colors (not directly mapped in Figma)
    // --------------------------------------------------

    // Buttons
    buttonPrimaryBg: string;
    buttonPrimaryAction: string;
    buttonSecondaryBg: string;
    buttonSecondaryAction: string;
    buttonLightBg: string;
    buttonLightAction: string;

    // Badge
    badgeAccent1Fg: string;
    badgeAccent1Bg: string;
    badgeAccent1MutedFg: string;
    badgeAccent1MutedBg: string;

    // Link
    linkPrimary: string;
    linkSecondary: string;

    // Logo
    logoPrimary: string;
    logoSecondary: string;

    // Border
    borderActive: string;

    // Surface Accent
    surfaceAccent1: string;
    surfaceAccent1Bg: string;
    surfaceAccent1Fg: string;
    surfaceAccent2: string;
    surfaceAccent2Bg: string;
    surfaceAccent2Fg: string;

    // Background
    bg: string;
    bgDarker: string;
    bgGlow1: string;
    bgGlow2: string;
    bgGlow3: string;
  };
  dark: {
    // Surfaces
    surface1: string;
    surface2: string;
    surface3: string;
    surface4: string;
    surfaceActiveAccent: string;
    surfaceActive: { main: string };

    // Accents
    accent1: string;
    accent1Alt: string;
    accent2: string;
    accent2Alt: string;

    // Border
    borderAccent1: string;
    border: { main: string };

    // --------------------------------------------------
    // UI Component Colors (not directly mapped in Figma)
    // --------------------------------------------------

    // Buttons
    buttonPrimaryBg: string;
    buttonPrimaryAction: string;
    buttonSecondaryBg: string;
    buttonSecondaryAction: string;
    buttonLightBg: string;
    buttonLightAction: string;

    // Badge
    badgeAccent1Fg: string;
    badgeAccent1Bg: string;
    badgeAccent1MutedFg: string;
    badgeAccent1MutedBg: string;

    // Link
    linkPrimary: string;
    linkSecondary: string;

    // Logo
    logoPrimary: string;
    logoSecondary: string;

    // Border
    borderActive: string;

    // Surface Accent
    surfaceAccent1: string;
    surfaceAccent1Bg: string;
    surfaceAccent1Fg: string;
    surfaceAccent2: string;
    surfaceAccent2Bg: string;
    surfaceAccent2Fg: string;

    // Background
    bg: string;
    bgDarker: string;
    bgGlow1: string;
    bgGlow2: string;
    bgGlow3: string;
  };
}

export const defaultBrandColors: BrandColors = {
  light: {
    // Surfaces
    surface1: baseColors.lavenderLight[0],
    surface2: baseColors.lavenderLight[100],
    surface3: baseColors.lavenderLight[200],
    surface4: baseColors.lavenderLight[300],
    surfaceActiveAccent: baseColors.orchid[100],
    surfaceActive: baseColors.alphaDark200,

    // Accents
    accent1: '#31007a',
    accent1Alt: '#31007a',
    accent2: '#8700B8',
    accent2Alt: '#FCEBFF',

    // Border
    borderAccent1: 'rgba(49, 0, 122, 0.08)',
    border: baseColors.alphaDark200,

    // --------------------------------------------------
    // UI Component Colors (not directly mapped in Figma)
    // --------------------------------------------------

    // Buttons
    buttonPrimaryBg: baseColors.lavenderDark[0],
    buttonPrimaryAction: baseColors.lavenderLight[0],
    buttonSecondaryBg: baseColors.lavenderLight[400],
    buttonSecondaryAction: baseColors.lavenderDark[100],
    buttonLightBg: baseColors.white.main,
    buttonLightAction: baseColors.black.main,

    // Badge
    badgeAccent1Fg: baseColors.white.main,
    badgeAccent1Bg: '#31007a',
    badgeAccent1MutedFg: baseColors.lavenderDark[0],
    badgeAccent1MutedBg: baseColors.lavenderLight[400],

    // Link
    linkPrimary: baseColors.lavenderDark[0],
    linkSecondary: baseColors.lavenderDark[0],

    // Logo
    logoPrimary: '#31007a',
    logoSecondary: '#8700B8',

    // Border
    borderActive: baseColors.orchid[400],

    // Surface Accent
    surfaceAccent1: baseColors.lavenderLight[100],
    surfaceAccent1Bg: baseColors.lavenderLight[100],
    surfaceAccent1Fg: baseColors.lavenderDark[0],
    surfaceAccent2: baseColors.orchid[800],
    surfaceAccent2Bg: baseColors.orchid[200],
    surfaceAccent2Fg: baseColors.orchid[800],

    // Background
    bg: baseColors.lavenderLight[200],
    bgDarker: baseColors.lavenderLight[400],
    bgGlow1: 'rgba(136, 0, 255, 0.12)',
    bgGlow2: 'rgba(187, 0, 255, 0.12)',
    bgGlow3: 'rgba(0, 68, 255, 0.12)',
  },
  dark: {
    // Surfaces
    surface1: baseColors.rubyDark[200],
    surface2: baseColors.rubyDark[300],
    surface3: baseColors.rubyDark[400],
    surface4: baseColors.rubyDark[500],
    surfaceActiveAccent: baseColors.rubyDark[100],
    surfaceActive: baseColors.alphaLight200,

    // Accents
    accent1: baseColors.rubyLight[400],
    accent1Alt: baseColors.rubyLight[0],
    accent2: baseColors.rubyLight[100],
    accent2Alt: baseColors.rubyLight[300],

    // Border
    borderAccent1: 'rgba(101, 59, 163, 0.08)',
    border: baseColors.alphaLight200,

    // --------------------------------------------------
    // UI Component Colors (not directly mapped in Figma)
    // --------------------------------------------------

    // Buttons
    buttonPrimaryBg: baseColors.rubyLight[400],
    buttonPrimaryAction: baseColors.lavenderLight[0],
    buttonSecondaryBg: baseColors.rubyLight[100],
    buttonSecondaryAction: baseColors.rubyLight[400],
    buttonLightBg: baseColors.rubyDark[200],
    buttonLightAction: baseColors.white.main,

    // Badge
    badgeAccent1Fg: baseColors.white.main,
    badgeAccent1Bg: baseColors.rubyLight[400],
    badgeAccent1MutedFg: baseColors.rubyLight[400],
    badgeAccent1MutedBg: baseColors.rubyLight[100],

    // Link
    linkPrimary: baseColors.rubyLight[400],
    linkSecondary: baseColors.rubyLight[400],

    // Logo
    logoPrimary: baseColors.rubyLight[100],
    logoSecondary: baseColors.violet[500],

    // Border
    borderActive: baseColors.rubyLight[400],

    // Surface Accent
    surfaceAccent1: baseColors.rubyLight[0],
    surfaceAccent1Bg: baseColors.rubyDark[0],
    surfaceAccent1Fg: baseColors.rubyLight[0],
    surfaceAccent2: baseColors.rubyLight[100],
    surfaceAccent2Bg: baseColors.rubyLight[400],
    surfaceAccent2Fg: baseColors.rubyLight[100],

    // Background
    bg: '#120b1e',
    bgDarker: baseColors.rubyDark[400],
    bgGlow1: baseColors.rubyLight[400],
    bgGlow2: baseColors.rubyLight[400],
    bgGlow3: baseColors.rubyLight[400],
  },
};

export const brandColors = defaultBrandColors;
