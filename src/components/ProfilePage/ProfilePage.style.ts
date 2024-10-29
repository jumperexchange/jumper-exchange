import type { Breakpoint } from '@mui/material';
import { Box, Container, Typography, alpha, styled } from '@mui/material';

export const ProfilePageContainer = styled(Container)(() => ({
  marginTop: 32,
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
  paddingBottom: 20,
}));

export const ProfileHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexDirection: 'column',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const ProfileInfoBox = styled(Box)(({ theme }) => ({
  gab: theme.spacing(2),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  flexDirection: 'column',
  boxShadow: theme.palette.shadow.main,
  padding: theme.spacing(2),

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },

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

export const CompletedTypography = styled(NoSelectTypography)(({ theme }) => ({
  color: '#000000',
}));

export const CenteredBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));
