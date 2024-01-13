import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface BannerProps extends Omit<BoxProps, 'component'> {
  backgroundImageUrl?: string;
}

export const Banner = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})<BannerProps>(({ theme, backgroundImageUrl }) => ({
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.accent1Alt.main,
}));
