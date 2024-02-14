import type { CardProps as MuiCardProps } from '@mui/material';
import { Card as MuiCard } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface CardProps extends Omit<MuiCardProps, 'component'> {
  backgroundImageUrl?: string;
  dark?: boolean;
}

export const FCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl' && prop !== 'dark',
})<CardProps>(({ theme, backgroundImageUrl, dark }) => ({
  width: 384,
  height: 160,
  cursor: 'pointer',
  borderRadius: '12px',
  position: 'relative',
  ...(dark && {
    backgroundColor: theme.palette.black.main,
  }),
  marginBottom: theme.spacing(1.5),
  overflow: 'hidden',
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: 'contain',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  ':last-child': {
    marginBottom: 0,
  },
}));
