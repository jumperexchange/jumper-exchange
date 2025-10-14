'use client';
import Box from '@mui/material/Box';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';

export const GoBackSkeleton = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <BadgeSkeleton size={BadgeSize.LG} color="grey" width={80} />
    </Box>
  );
};
