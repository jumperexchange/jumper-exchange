import { Box, styled } from '@mui/material';
import {
  PaginationButton,
  type PaginationButtonProps,
} from './Pagination.style';

export const PaginationButtonNavigatorBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const PaginationButtonNavigator = styled(
  PaginationButton,
)<PaginationButtonProps>(() => ({
  display: 'flex',
  height: '34px',
  width: '34px',
}));
