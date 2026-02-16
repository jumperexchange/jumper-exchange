import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const StyledOverviewContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(1),
  alignItems: 'flex-start',
}));

export const overviewContentSx: SxProps<Theme> = {
  flexDirection: 'column-reverse',
};
