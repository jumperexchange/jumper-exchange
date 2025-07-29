import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  RankCardContainer,
  BaseStyledSkeleton,
  RankButtonContainer,
  RankCardContentContainer,
} from './RankCard.styles';

export const RankCardSkeleton = () => {
  return (
    <RankCardContainer>
      <SectionCard>
        <RankCardContentContainer>
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 32,
              width: 96,
              borderRadius: 16,
            }}
          />
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 48,
              width: 128,
              borderRadius: 24,
              mt: 1,
              mb: 2,
            }}
          />
          <RankButtonContainer>
            <BaseStyledSkeleton
              variant="rounded"
              animation="wave"
              sx={{
                height: 40,
                width: '100%',
                borderRadius: 20,
              }}
            />
          </RankButtonContainer>
        </RankCardContentContainer>
      </SectionCard>
    </RankCardContainer>
  );
};
