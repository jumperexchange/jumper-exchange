import { IconButton, styled } from '@mui/material';
import { getContrastAlphaColor } from 'src/utils';

export const ButtonBackArrowWrapper = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));
