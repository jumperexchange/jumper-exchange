import { sora } from '@/fonts/fonts';
import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, alpha, darken } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconButtonPrimary } from 'src/components/IconButton';

export const MissionCtaContainer = styled(Box)<BoxProps>(({ theme }) => ({
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
  backgroundColor: '#69d7ff',
  '&:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken('#69d7ff', 0.02) //todo: add to theme
        : alpha('#69d7ff', 0.16),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: theme.spacing(4),
    flexDirection: 'row',
  },
}));

export const SeveralMissionCtaContainer = styled(Box)<BoxProps>(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    mardingBottom: '16px',
    gap: theme.spacing(1.5),
    cursor: 'pointer',
    overflow: 'hidden',
    textAlign: 'center',
    transition: 'background-color 250ms',
    borderRadius: '16px',
    backgroundColor: '#69d7ff',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor:
        theme.palette.mode === 'light'
          ? darken('#69d7ff', 0.02) //todo: add to theme
          : alpha('#69d7ff', 0.16),
    },
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      gap: theme.spacing(4),
      flexDirection: 'row',
    },
  }),
);

export const MissionCtaTitle = styled(Box)<BoxProps>(({ theme }) => ({
  fontFamily: sora.style.fontFamily,
  fontWeight: 700,
  color: theme.palette.black.main,
  fontSize: '32px',
  lineHeight: '38px',
  userSelect: 'none',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '40px',
    lineHeight: '56px',
    textDecoration: 'auto',
  },
}));

export const MissionCtaButton = styled(IconButtonPrimary)(({ theme }) => ({
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'flex',
  },
}));

export const CTABox = styled(Box)(({ theme }) => ({
  width: '80%',
  maxWidth: '1210px',
  display: 'flex',
  marginTop: '32px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
}));

export const SeveralCTABox = styled(Box)(({ theme }) => ({
  width: '80%',
  maxWidth: '1210px',
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  marginTop: '64px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));
