import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { alpha, styled } from '@mui/material/styles';

export const DiscordBanner = styled(Box)<BoxProps>(({ theme }) => ({
  // background: darken(theme.palette.surface1.main, 0.04),
  background:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.surface1.main, 0.8)
      : alpha(theme.palette.white.main, 0.8),
}));
