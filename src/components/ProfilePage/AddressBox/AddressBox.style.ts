import {
  Box,
  ButtonProps,
  Container,
  Typography,
  alpha,
  styled,
  Button as MuiButton,
  darken,
  ButtonProps as MuiButtonProps,
  IconButtonProps,
  IconButton,
} from '@mui/material';

export const ProfileIconButton = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : alpha(theme.palette.grey[100], 0.08),
    width: '32px',
    height: '32px',
    marginLeft: 8,
  }),
);

export const BackgroundBox = styled(Box)(({ theme }) => ({
  height: '50%',
  backgroundColor: theme.palette.mode === 'light' ? '#31007A' : '#BEA0EB',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
}));

export const AddressDisplayBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50%',
  marginTop: 4,
}));

export const PassImageBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  bottom: '75%',
}));
