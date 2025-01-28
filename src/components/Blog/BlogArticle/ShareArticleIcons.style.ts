import { Box, Skeleton, styled } from '@mui/material';

export const ShareIconsContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',

  'button:first-of-type': {
    margin: 0,
  },
}));

export const ShareIconsSkeletons = styled(Skeleton)(() => ({
  width: 176,
  height: 40,
  borderRadius: '20px',
}));
