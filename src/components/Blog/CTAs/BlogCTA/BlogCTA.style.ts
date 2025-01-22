import { urbanist } from '@/fonts/fonts';
import type { Breakpoint } from '@mui/material';
import { Box, alpha, darken } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconButtonPrimary } from 'src/components/IconButton';

export const BlogCtaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(8),
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  overflow: 'hidden',
  textAlign: 'center',
  margin: theme.spacing(6, 0),
  transition: 'background-color 250ms',
  borderRadius: '16px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08), //todo: add to theme
  '&:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken('#F9F5FF', 0.02)
        : alpha(theme.palette.white.main, 0.16), //todo: add to theme
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: theme.spacing(4),
    flexDirection: 'row',
  },
}));

export const BlogCtaTitle = styled(Box)(({ theme }) => ({
  fontFamily: urbanist.style.fontFamily,
  fontWeight: 700,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.accent1Alt.main,
  fontSize: '32px',
  lineHeight: '38px',
  userSelect: 'none',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '40px',
    lineHeight: '56px',
    textDecoration: 'auto',
  },
}));

export const BlogCtaButton = styled(IconButtonPrimary)(({ theme }) => ({
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'flex',
  },
}));
