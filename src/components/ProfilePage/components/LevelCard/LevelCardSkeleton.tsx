import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  BaseStyledSkeleton,
  LevelCardContainer,
  LevelCardContentContainer,
  LevelGroupContainer,
  LevelProgressContainer,
} from './LevelCard.style';

export const LevelCardSkeleton = () => {
  return (
    <LevelCardContainer>
      <SectionCard>
        <LevelCardContentContainer>
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 34,
              width: 96,
              borderRadius: 16,
            }}
          />
          <LevelGroupContainer sx={{ mt: 1, mb: 2 }}>
            <BaseStyledSkeleton
              variant="rounded"
              animation="wave"
              sx={{
                height: 48,
                width: 128,
                borderRadius: 24,
              }}
            />
            <BaseStyledSkeleton
              variant="rounded"
              animation="wave"
              sx={{
                height: 48,
                width: 128,
                borderRadius: 24,
              }}
            />
          </LevelGroupContainer>
          <LevelProgressContainer>
            <BaseStyledSkeleton
              variant="rounded"
              animation="wave"
              sx={{
                height: 8,
                width: '100%',
                borderRadius: 4,
              }}
            />
            <BaseStyledSkeleton
              variant="rounded"
              animation="wave"
              sx={{
                height: 34,
                width: 96,
                borderRadius: 16,
              }}
            />
          </LevelProgressContainer>
        </LevelCardContentContainer>
      </SectionCard>
    </LevelCardContainer>
  );
};
