import type { TypographyProps } from '@mui/material';
import { Typography, alpha, keyframes, lighten, styled } from '@mui/material';

export interface TagProps extends Omit<TypographyProps, 'component'> {
  component?: keyof JSX.IntrinsicElements;
  backgroundColor?: string;
  color?: string;
}

const moveGradient = keyframes`
50% {
  background-position: 100% 50%;
}
`;
export const Tag = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'backgroundColor',
})<TagProps>(({ theme, backgroundColor, color }) => ({
  height: 48,
  fontSize: '14px',
  lineHeight: '24px',
  padding: theme.spacing(0, 3),
  width: 'fit-content',
  backgroundColor: backgroundColor
    ? backgroundColor
    : theme.palette.mode === 'light'
      ? alpha(theme.palette.black.main, 0.04)
      : lighten(theme.palette.black.main, 0.04),
  color: color
    ? color
    : theme.palette.mode === 'light'
      ? theme.palette.black.main
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
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
