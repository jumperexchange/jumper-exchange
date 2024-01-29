import type { TypographyProps } from '@mui/material';
import { Typography, keyframes, styled } from '@mui/material';

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
  height: '40px',
  fontSize: '14px',
  lineHeight: '24px',
  padding: theme.spacing(1, 2),
  backgroundColor: backgroundColor
    ? backgroundColor
    : theme.palette.mode === 'light'
      ? theme.palette.secondary.main
      : theme.palette.accent1Alt.main,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',

  color: color
    ? color
    : theme.palette.mode === 'light'
      ? theme.palette.grey[700]
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

  '--border-width': '1px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textTransform: 'uppercase',
  background: theme.palette.surface1.main,

  '&:after': {
    position: 'absolute',
    borderRadius: '20px',
    content: '""',
    top: 'calc(-1 * var(--border-width))',
    left: 'calc(-1 * var(--border-width))',
    zIndex: '-1',
    width: 'calc(100% + var(--border-width) * 2)',
    height: 'calc(100% + var(--border-width) * 2)',
    background: `linear-gradient(
        60deg,
        hsl(277, 72%, 94%),
        hsl(244, 100%, 94%),
        hsl(259, 92%, 95%),
        hsl(295, 57%, 92%),
        hsl(253, 100%, 95%),
        hsl(264, 47%, 88%),
        hsl(264, 47%, 98%)
      )`,
    backgroundSize: '300% 300%',
    backgroundPosition: '0 50%',
    animation: `${moveGradient} 4s alternate infinite`,
  },
}));
