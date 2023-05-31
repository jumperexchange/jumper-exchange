import { AppBar, AppBarProps, Box } from '@mui/material';

import { alpha, styled } from '@mui/material/styles';

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
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.surface2.main, 0.2)
        : alpha(theme.palette.surface1.main, 0.84),
    backdropFilter: 'blur(12px)',
    boxShadow: 'unset',
    backgroundImage: theme.palette.mode === 'dark' && 'unset',
  }),
);

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
}));
