import { AppBar, AppBarProps, Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface ModalHeaderAppBarProps extends Omit<AppBarProps, 'component'> {
  component?: string;
}

export const ModalHeaderAppBar = styled(AppBar)<ModalHeaderAppBarProps>(
  ({ theme }) => ({
    zIndex: 1500,
    left: 'initial',
    right: 'initial',
    position: 'sticky',
    color: theme.palette.text.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    top: 0,
    padding: theme.spacing(3, 6),
    backdropFilter: 'blur(12px)',
    boxShadow: 'unset',
    background: 'transparent',
  }),
);

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
}));
