import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
}));
