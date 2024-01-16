import type { Breakpoint } from '@mui/material';

import { styled } from '@mui/material/styles';

export const BlogPreviewCardImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.grey[300]}`,
  [theme.breakpoints.up('sm' as Breakpoint)]: {},
  [theme.breakpoints.up('md' as Breakpoint)]: {},
}));
