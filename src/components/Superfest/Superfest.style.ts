import { Superfest } from './Superfest';
import type { TypographyProps } from '@mui/material';
import { Box, Container, Typography, alpha, styled } from '@mui/material';

export const SuperfestContainer = styled(Container)(() => ({
  marginTop: 32,
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
  paddingBottom: 20,
}));

// export const ProfilePageTypography = styled(
//   Typography,
// )<ProfilePageTypographyProps>(({ fontWeight, lineHeight }) => ({
//   // fontSize: fontSize,
//   fontWeight: fontWeight ?? 700,
//   lineHeight: lineHeight,
//   userSelect: 'none',
// }));

export const CenteredBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));
