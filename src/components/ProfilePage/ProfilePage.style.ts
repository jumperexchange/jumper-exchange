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
