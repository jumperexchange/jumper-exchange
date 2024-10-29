import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

export const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  width: 16,
  height: 16,
  opacity: '0.24',
  marginLeft: theme.spacing(1),
}));
