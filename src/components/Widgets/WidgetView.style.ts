import { Box, Skeleton as MuiSkeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WidgetSkeletonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transform: 'translateY(-56px)',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(8, 3, 6.25),
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
  borderRadius: theme.shape.borderRadius,
}));

export const Skeleton = styled(MuiSkeleton)(({ theme }) => ({
  backgroundColor: theme.palette.surface2.main,
}));
