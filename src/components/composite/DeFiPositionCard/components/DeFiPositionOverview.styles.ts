import { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const StyledOverviewContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(1),
  maxWidth: '100%',
  alignItems: 'center',
}));

export const overviewContentSx: SxProps<Theme> = {
  flexDirection: 'column-reverse',
  gap: 0,
};
