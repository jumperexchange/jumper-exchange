'use client';
import type {
  AppBarProps,
  BoxProps,
  Breakpoint,
  GridProps,
} from '@mui/material';
import {
  AppBar,
  Avatar,
  Box,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import { alpha, styled } from '@mui/material/styles';

export interface ModalContainerProps extends Omit<BoxProps, 'component'> {
  component?: string;
}

export const ModalContainer = styled(Box)<ModalContainerProps>(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: 'auto',
  paddingBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: theme.shadows[1],
  width: `calc( 100% - ${theme.spacing(3)})`,
  maxWidth: 640,
  maxHeight: '85%',
  overflowY: 'auto',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.surface1.main
      : theme.palette.surface2.main,
  '&:focus-visible': {
    outline: 0,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: 0,
    width: 640,
  },
}));

export const ModalContent = styled(Grid)<GridProps>(({ theme }) => ({
  alignItems: 'center',
  gap: '26px',
  padding: theme.spacing(0, 3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    justifyContent: 'inherit',
  },
}));

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
    padding: theme.spacing(1.5, 3),
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.surface1.main, 0.84)
        : alpha(theme.palette.surface2.main, 0.2),
    backdropFilter: 'blur(12px)',
    boxShadow: 'unset',
    backgroundImage: 'unset',
    '@supports ( -moz-appearance:none )': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.surface1.main
          : theme.palette.surface2.main,
    },
  }),
);

export const ModalHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
}));

export const ToolModalTitle = styled(Typography)(() => ({
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '18px',
  lineHeight: '24px',
  maxWidth: '80%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const ToolModalIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transform: 'translateX(8px)',
}));

export const ToolModalGrid = styled(Grid)(() => ({
  width: 72,
  textAlign: 'center',
}));

export const ToolModalAvatar = styled(Avatar)(() => ({
  margin: 'auto',
  height: 48,
  width: 48,
}));

export const ToolModaItemlTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 72,
  height: 32,
  maxHeight: 32,
  marginTop: theme.spacing(1.5),
}));
