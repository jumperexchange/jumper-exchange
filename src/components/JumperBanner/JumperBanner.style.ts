import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface JumperBannerContainerProps
  extends Omit<BoxProps, 'component'> {
  backgroundImageUrl?: string;
}

export const JumperBannerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})<JumperBannerContainerProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  flexDirection: 'row',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.accent1Alt.main,
}));
