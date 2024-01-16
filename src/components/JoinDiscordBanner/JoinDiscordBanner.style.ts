import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export const DiscordBanner = styled(Box)<BoxProps>(({ theme }) => ({
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.accent1Alt.main,
}));
