import { baseColors } from './baseColors';

export const brandColors = {
  light: {
    surface1: baseColors.lavenderLight[0],
    surface2: baseColors.lavenderLight[100],
    surface3: baseColors.lavenderLight[200],
    surface4: baseColors.lavenderLight[300],
    surfaceActiveAccent: baseColors.orchid[100],
    surfaceActive: baseColors.alphaDark200,
    accent1: '#31007a',
    accent1Alt: '#31007a',
    accent2: '#8700B8',
    accent2Alt: '#FCEBFF',
    borderAccent1: 'rgba(49, 0, 122, 0.08)',
    border: baseColors.alphaDark200,
  },
  dark: {
    surface1: baseColors.rubyDark[200],
    surface2: baseColors.rubyDark[300],
    surface3: baseColors.rubyDark[400],
    surface4: baseColors.rubyDark[500],
    surfaceActiveAccent: '#341e52',
    surfaceActive: baseColors.alphaLight200,
    accent1: baseColors.rubyLight[400],
    accent1Alt: baseColors.rubyLight[0],
    accent2: baseColors.rubyLight[100],
    accent2Alt: baseColors.rubyLight[300],
    borderAccent1: 'rgba(101, 59, 163, 0.08)',
    border: baseColors.alphaLight200,
  },
};
