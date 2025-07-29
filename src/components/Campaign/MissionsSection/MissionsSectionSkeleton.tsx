'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  BaseSkeletonBox,
  MissionSectionContainer,
} from './MissionsSection.style';
import Box from '@mui/material/Box';
import { CompactEntityCardSkeleton } from 'src/components/Cards/EntityCard/variants/CompactEntityCardSkeleton';
import { FC } from 'react';
import { GridContainer } from 'src/components/Containers/GridContainer';

interface MissionsSectionSkeletonProps {
  cardCount?: number;
}

export const MissionsSectionSkeleton: FC<MissionsSectionSkeletonProps> = ({
  cardCount = 5,
}) => {
  return (
    <SectionCard>
      <MissionSectionContainer>
        <BaseSkeletonBox
          variant="rounded"
          animation="wave"
          sx={{
            width: 136,
            height: 32,
          }}
        />
        <GridContainer>
          {Array.from({ length: cardCount }).map((_, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: 'center',
                justifySelf: 'center',
                width: '100%',
              }}
            >
              <CompactEntityCardSkeleton fullWidth />
            </Box>
          ))}
        </GridContainer>
      </MissionSectionContainer>
    </SectionCard>
  );
};
