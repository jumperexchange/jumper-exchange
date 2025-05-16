import { styled } from '@mui/material';
import { ButtonPrimary } from 'src/components/Button';

export const BackButtonStyles = styled(ButtonPrimary)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'center',
  alignItems: 'center',
}));
