import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

export const usePortfolioChartTheme = () => {
  const theme = useTheme();
  return useMemo(() => {
    const palette = (theme.vars || theme).palette;
    return {
      areaTopColor: `color-mix(in srgb, ${palette.surfaceAccent2Bg} 30%, transparent)`,
      areaBottomColor: `color-mix(in srgb, ${palette.surface1.main} 30%, transparent)`,
      pointColor: `color-mix(in srgb, ${palette.accent1.main} 30%, transparent)`,
      lineColor: `color-mix(in srgb, ${palette.textAccent2} 30%, transparent)`,
    };
  }, [theme]);
};
