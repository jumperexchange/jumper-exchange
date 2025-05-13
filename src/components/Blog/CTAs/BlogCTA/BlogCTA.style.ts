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
  //todo: add to theme
  backgroundColor: alpha(theme.palette.white.main, 0.08),
  '&:hover': {
    cursor: 'pointer',
    //todo: add to theme
    backgroundColor: alpha(theme.palette.white.main, 0.16),
    ...theme.applyStyles('light', {
      backgroundColor: darken('#F9F5FF', 0.02),
    }),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: theme.spacing(4),
    flexDirection: 'row',
  },
  ...theme.applyStyles('light', {
    backgroundColor: '#F9F5FF',
  }),
}));

export const BlogCtaTitle = styled(Box)(({ theme }) => ({
  fontFamily: urbanist.style.fontFamily,
  fontWeight: 700,
  color: (theme.vars || theme).palette.accent1Alt.main,
  fontSize: '32px',
  lineHeight: '38px',
  userSelect: 'none',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '40px',
    lineHeight: '56px',
    textDecoration: 'auto',
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

export const BlogCtaButton = styled(IconButtonPrimary)(({ theme }) => ({
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'flex',
  },
}));
