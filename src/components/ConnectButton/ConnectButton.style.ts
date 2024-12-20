import { ButtonPrimary } from '@/components/Button';
import { styled, Typography } from '@mui/material';

export const ConnectButtonStyle = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(3),
  textWrap: 'nowrap',
}));

export const ConnectButtonLabel = styled(Typography)(() => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));
