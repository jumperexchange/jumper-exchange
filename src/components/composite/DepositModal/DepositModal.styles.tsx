import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { IconButton } from 'src/components/IconButton';

export const CenteredWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  outline: 'none',
}));

export const CloseIconButton = styled(IconButton)(({ theme }) => ({
  width: '40px',
  height: '40px',
  color: `${(theme.vars || theme).palette.buttonAlphaDarkAction} !important`,
  backgroundColor: `${(theme.vars || theme).palette.buttonAlphaDarkBg} !important`,
  ...theme.applyStyles('light', {
    color: `${(theme.vars || theme).palette.buttonAlphaLightAction} !important`,
    backgroundColor: `${(theme.vars || theme).palette.buttonAlphaLightBg} !important`,
  }),
  transition: 'opacity 0.3s',
}));
