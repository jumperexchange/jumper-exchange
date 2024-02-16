import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export const JumperBannerContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  flexDirection: 'row',
  padding: theme.spacing(6),
  margin: theme.spacing(6, 0),
  borderRadius: '16px',
  background:
    theme.palette.mode === 'light'
      ? '#F6F0FF' //todo: add to theme
      : theme.palette.accent1Alt.main,
}));
