import { MissionTaskCardSkeleton } from 'src/components/Cards/MissionTaskCard/MissionTaskCardSkeleton';
import { BaseSkeleton, MissionDetailsContainer } from './MissionDetails.style';
import { WideEntityCardSkeleton } from 'src/components/Cards/EntityCard/variants/WideEntityCardSkeleton';
import Box from '@mui/material/Box';

export const MissionDetailsSkeleton = () => {
  return (
    <MissionDetailsContainer>
      <Box sx={{ width: '100%' }}>
        <BaseSkeleton variant="rounded" sx={{ width: 120, height: 36 }} />
      </Box>
      <WideEntityCardSkeleton />
      {Array.from({ length: 3 }).map((_, index) => (
        <MissionTaskCardSkeleton key={index} />
      ))}
    </MissionDetailsContainer>
  );
};
