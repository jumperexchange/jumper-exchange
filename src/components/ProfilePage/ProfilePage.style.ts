import {
  Box,
  Container,
  Typography,
  TypographyProps,
  alpha,
  styled,
} from '@mui/material';

export const ProfilePageContainer = styled(Container)(() => ({
  marginTop: 32,
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
}));

export const ProfilePageHeaderBox = styled(Box)(({ theme, style }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08),
  height: '312px',
  borderRadius: '24px',
  ...style,
}));

export interface ProfilePageTypographyProps
  extends Omit<TypographyProps, 'component'> {
  fontSize: string | number;
  lineHeight: string;
  fontWeight?: number;
}

export const ProfilePageTypography = styled(
  Typography,
)<ProfilePageTypographyProps>(
  ({ style, fontSize, fontWeight, lineHeight }) => ({
    ...style,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: fontSize,
    fontWeight: fontWeight ?? 700,
    lineHeight: lineHeight,
  }),
);

export const CenteredBox = styled(Box)(({ style }) => ({
  display: 'flex',
  alignItems: 'center',
  ...style,
}));
