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
    surface1: '#302B52',
    surface2: '#24203D',
    surface3: '#120F29',
    surface4: '#030014',
    surfaceActiveAccent: 'rgba(101, 59, 163, 0.08)',
    surfaceActive: baseColors.alphaLight200,
    accent1: '#BEA0EB',
    accent1Alt: '#653BA3',
    accent2: '#D35CFF',
    accent2Alt: '#662C7A',
    borderAccent1: 'rgba(101, 59, 163, 0.08)',
    border: baseColors.alphaLight200,
  },
};
