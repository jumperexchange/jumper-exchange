import type { TypographyProps } from '@mui/material';
import { Typography, alpha, styled } from '@mui/material';

export interface TagProps extends TypographyProps {
  component?: keyof JSX.IntrinsicElements;
  backgroundColor?: string;
  color?: string;
}

export const Tag = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'backgroundColor',
})<TagProps>(({ theme, backgroundColor, color }) => ({
  height: 48,
  padding: theme.spacing(0, 3),
  textWrap: 'nowrap',
  width: 'fit-content',
  backgroundColor: backgroundColor
    ? backgroundColor
    : theme.palette.mode === 'light'
      ? alpha(theme.palette.black.main, 0.04)
      : theme.palette.alphaLight300.main,
  color: color ? color : theme.palette.text.primary,
  userSelect: 'none',
  borderRadius: '24px',
  flexShrink: 0,
  ':not(:first-of-type)': {
    marginLeft: theme.spacing(0.5),
  },
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
