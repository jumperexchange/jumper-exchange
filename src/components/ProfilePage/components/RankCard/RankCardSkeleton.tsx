import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  BaseStyledSkeleton,
  RankButton,
  RankCardContainer,
  RankCardContentContainer,
  rankCardSx,
} from './RankCard.styles';

export const RankCardSkeleton = () => {
  return (
    <RankCardContainer>
      <SectionCard sx={rankCardSx}>
        <RankCardContentContainer>
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={(theme) => ({
              height: theme.spacing(2),
              width: theme.spacing(8),
              borderRadius: `${theme.shape.radius8}px`,
            })}
          />
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={(theme) => ({
              height: theme.spacing(6.5),
              width: theme.spacing(12),
              borderRadius: `${theme.shape.radius12}px`,
              mt: 1,
            })}
          />
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={(theme) => ({
              height: theme.spacing(2),
              width: theme.spacing(15),
              borderRadius: `${theme.shape.radius8}px`,
              mt: 1,
            })}
          />
        </RankCardContentContainer>
        <RankButton disabled>
          <BaseStyledSkeleton
            variant="rounded"
            animation="wave"
            sx={(theme) => ({
              height: theme.spacing(2.25),
              width: theme.spacing(15),
              borderRadius: `${theme.shape.radius8}px`,
            })}
          />
        </RankButton>
      </SectionCard>
    </RankCardContainer>
  );
};
