import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export const JumperBannerContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  flexDirection: 'row',
  padding: theme.spacing(6),
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.accent1Alt.main,
}));
