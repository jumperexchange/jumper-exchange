import { HeaderHeight } from '@/const/headerHeight';
import { Modal as MUIModal } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SupportMuiModal = styled(MUIModal)(({ theme }) => ({
  paddingTop: HeaderHeight.XS,
  zIndex: 1500,
  overflow: 'auto',
}));
