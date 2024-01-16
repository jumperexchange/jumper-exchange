import type { TypographyProps } from '@mui/material';
import { Typography, styled } from '@mui/material';

export interface TagProps extends Omit<TypographyProps, 'component'> {
  component?: keyof JSX.IntrinsicElements;
  backgroundColor?: string;
  color?: string;
}

export const Tag = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'backgroundColor',
})<TagProps>(({ theme, backgroundColor, color }) => ({
  height: '40px',
  fontSize: '14px',
  lineHeight: '24px',
  padding: theme.spacing(1, 2),
  backgroundColor: backgroundColor
    ? backgroundColor
    : theme.palette.mode === 'light'
      ? theme.palette.secondary.main
      : theme.palette.accent1Alt.main,
  color: color
    ? color
    : theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
  userSelect: 'none',
  borderRadius: '24px',
  flexShrink: 0,
  // boxShadow:
  //   theme.palette.mode === 'dark'
  //     ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
  //     : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  ':not(:first-of-type)': {
    marginLeft: theme.spacing(0.5),
  },
  '&:before': {
    content: '"#"',
    marginRight: theme.spacing(0.5),
  },
}));
