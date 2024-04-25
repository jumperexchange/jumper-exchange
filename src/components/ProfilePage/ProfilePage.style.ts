import type { TypographyProps } from '@mui/material';
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
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : alpha(theme.palette.grey[100], 0.08),
  borderRadius: '24px',
}));

export interface ProfilePageTypographyProps
  extends Omit<TypographyProps, 'component'> {
  lineHeight?: string;
  fontWeight?: number;
}

export const ProfilePageTypography = styled(
  Typography,
)<ProfilePageTypographyProps>(({ fontWeight, lineHeight }) => ({
  // fontSize: fontSize,
  fontWeight: fontWeight ?? 700,
  lineHeight: lineHeight,
  userSelect: 'none',
}));

export const CenteredBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));
