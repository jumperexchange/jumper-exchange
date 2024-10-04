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

export const ProfilePageHeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  boxShadow: theme.palette.shadow.main,
}));

export const NoSelectTypographyTitle = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
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

export const FlexCenterRowBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
}));

export const FlexCenterSpaceRowBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'center',
}));

export const FlexSpaceBetweenBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));
