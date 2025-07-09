'use client';
import { CompactEntityCardSkeleton } from 'src/components/Cards/EntityCard/variants/CompactEntityCardSkeleton';
import { FC } from 'react';
import Box from '@mui/material/Box';

interface MissionsListSkeletonProps {
  count?: number;
}

export const MissionsListSkeleton: FC<MissionsListSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            alignSelf: 'center',
            justifySelf: 'center',
          }}
        >
          <CompactEntityCardSkeleton />
        </Box>
      ))}
    </>
  );
};
