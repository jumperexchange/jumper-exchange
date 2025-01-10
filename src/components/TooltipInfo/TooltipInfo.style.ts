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

export const StyledInfoIcon = styled(InfoIcon)<StyledInfoIconProps>(
  ({ theme, size }) => ({
    width: size || 16,
    height: size || 16,
    opacity: theme.palette.mode === 'light' ? 0.24 : 0.72,
    marginLeft: theme.spacing(1),
  }),
);
