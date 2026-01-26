import type { Theme } from '@mui/material/styles';
import type { BorderConfig } from '../borders';

type SurfaceKey = 'surface1' | 'surface2' | 'surface3' | 'surface4';

/**
 * Returns a CSS border string for the given surface key.
 * If the border width is 0, returns 'none'.
 */
export const getSurfaceBorder = (
  theme: Theme,
  surfaceKey: SurfaceKey,
): string => {
  const borderConfig: BorderConfig = theme.borders?.[surfaceKey];

  if (!borderConfig) {
    return 'none';
  }

  if (borderConfig.width === 0 || borderConfig.style === 'none') {
    return 'none';
  }

  return `${borderConfig.width}px ${borderConfig.style} ${borderConfig.color}`;
};
