import InfoIcon from '@mui/icons-material/Info';
import { Tooltip as MuiTooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Tooltip = styled(MuiTooltip)<StyledInfoIconProps>(({ theme }) => ({
  cursor: 'help',
  color: theme.palette.text.primary,
}));

interface StyledInfoIconProps {
  size?: number;
}

export const StyledInfoIcon = styled(InfoIcon, {
  shouldForwardProp: (prop) => prop !== 'size',
})<StyledInfoIconProps>(({ theme, size }) => ({
  width: size || 16,
  height: size || 16,
  opacity: 0.72,
  marginLeft: theme.spacing(1),
  ...theme.applyStyles('light', {
    opacity: 0.24,
  }),
}));
