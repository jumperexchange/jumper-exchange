import { Box, styled } from '@mui/material';

export const BlogWidgetHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(3),
}));
