import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export const DiscordBanner = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: '#EDE0FF', //todo: add to theme
  padding: theme.spacing(12, 8),
  margin: theme.spacing(8),
  borderRadius: '32px',
}));
