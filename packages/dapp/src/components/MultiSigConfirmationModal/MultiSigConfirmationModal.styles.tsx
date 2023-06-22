import { Box, BoxProps } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';

export interface ModalContainerProps extends Omit<BoxProps, 'component'> {
  component?: string;
}

export const MultiSigConfirmationModalContainer = styled(
  Box,
)<ModalContainerProps>(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: 'auto',
  paddingBottom: theme.spacing(6),
  borderRadius: '12px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  width: `calc( 100% - ${theme.spacing(6)})`,
  maxWidth: '640px',
  maxHeight: '85%',
  overflowY: 'auto',
  background:
    theme.palette.mode === 'dark'
      ? theme.palette.surface2.main
      : theme.palette.surface1.main,

  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: 0,
    width: '640px',
  },
}));

export const MultiSigConfirmationModalContent = styled(Box)<BoxProps>(
  ({ theme }) => ({
    alignItems: 'center',
    padding: theme.spacing(6),
    textAlign: 'center',
  }),
);
