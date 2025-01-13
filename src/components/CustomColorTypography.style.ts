import { urbanist } from '@/fonts/fonts';
import type { Breakpoint } from '@mui/material';
import { Typography, styled } from '@mui/material';

export const CustomColor = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 10%, #D35CFF 100%);`,
  backgroundClip: 'text',
  margin: 0,
  fontFamily: urbanist.style.fontFamily,
  fontSize: '48px',
  fontWeight: 700,
  lineHeight: '56px',
  textFillColor: 'transparent',
  userSelect: 'none',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '64px',
    lineHeight: '72px',
  },
  ...theme.applyStyles('dark', {
    background: `linear-gradient(90deg, #FFF 25%, ${theme.palette.accent1Alt.main} 50%, #D35CFF 75%)`,
  }),
}));
