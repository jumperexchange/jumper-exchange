import type { Breakpoint } from '@mui/material';
import { Box, Container, Typography, alpha, styled } from '@mui/material';

export const PageContainer = styled(Container)(({ theme }) => ({
  marginTop: 16,
  fontFamily: 'var(--font-inter)',
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'visible', //'hidden',
  paddingBottom: 20,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  margin: theme.spacing(0, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
}));

export const ProfileHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const ProfileInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 2,
  gap: theme.spacing(2),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },
}));

export const ProfileInfoBoxCards = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const NoSelectTypographyTitle = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  color: theme.palette.text.primary,
  lineHeight: '64px',
  fontWeight: 700,
  fontSize: 48,
}));

export const NoSelectTypographyTitlePosition = styled(NoSelectTypographyTitle, {
  shouldForwardProp: (prop) => prop !== 'hasPosition',
})<{ hasPosition: boolean }>(({ theme, hasPosition }) => ({
  borderRadius: '12px',
  textIndent: '12px',
  fontWeight: 700,
  ...(hasPosition
    ? {
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in',
        '&:hover': {
          backgroundColor: alpha(theme.palette.black.main, 0.04),
        },
      }
    : {
        pointerEvents: 'none',
      }),
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    fontSize: 28,
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: 48,
  },
}));

export const NoSelectTypography = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  color: theme.palette.text.primary,
}));
