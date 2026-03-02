import type { BoxProps } from '@mui/material';
import { Box, Typography, keyframes, styled } from '@mui/material';

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.8); }
`;

export const ShareCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  gap: theme.spacing(1.5),
}));

export const ShareCardIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 10,
  flexShrink: 0,
  backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  color: (theme.vars || theme).palette.text.primary,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
  }),
}));

export const ShareCardInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

export const ShareCardLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMedium,
  fontWeight: 600,
  color: (theme.vars || theme).palette.text.primary,
}));

interface ShareCardStatusProps extends BoxProps {
  statusColor?: string;
  isWorking?: boolean;
}

export const ShareCardStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusColor' && prop !== 'isWorking',
})<ShareCardStatusProps>(({ theme, statusColor, isWorking }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  ...theme.typography.bodySmall,
  color: (theme.vars || theme).palette.text.secondary,
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor:
      statusColor ?? (theme.vars || theme).palette.text.secondary,
    flexShrink: 0,
    ...(isWorking && {
      animation: `${pulse} 1.2s ease-in-out infinite`,
    }),
  },
}));
