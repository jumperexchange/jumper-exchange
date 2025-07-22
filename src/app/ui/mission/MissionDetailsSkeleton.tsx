import { TaskCardSkeleton } from 'src/components/Cards/TaskCard/TaskCardSkeleton';
import {
  BaseSkeleton,
  MissionDetailsColumnContainer,
  MissionDetailsCardContainer,
} from './MissionDetails.style';
import { WideEntityCardSkeleton } from 'src/components/Cards/EntityCard/variants/WideEntityCardSkeleton';
import Box from '@mui/material/Box';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

export const MissionDetailsSkeleton = () => {
  return (
    <MissionDetailsColumnContainer>
      <SectionCardContainer>
        <MissionDetailsCardContainer>
          <Box sx={{ width: '100%' }}>
            <BaseSkeleton variant="rounded" sx={{ width: 120, height: 36 }} />
          </Box>
          <WideEntityCardSkeleton />
          {Array.from({ length: 3 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </MissionDetailsCardContainer>
      </SectionCardContainer>
    </MissionDetailsColumnContainer>
  );
};
