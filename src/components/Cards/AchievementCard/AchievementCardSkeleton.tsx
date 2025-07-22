import {
  AchievementCardActionArea,
  AchievementCardContainer,
  AchievementCardContent,
  AchievementCardLabel,
  BaseSkeleton,
  BaseStyledSkeleton,
} from './AchievementCard.style';

export const AchievementCardSkeleton = () => {
  return (
    <AchievementCardContainer>
      <AchievementCardActionArea focusRipple={false} disabled>
        <BaseSkeleton variant="rectangular" width={'100%'} height={320} />
        <AchievementCardContent>
          <AchievementCardLabel>
            <BaseStyledSkeleton
              animation="wave"
              variant="text"
              width={100}
              height={24}
            />
            <BaseStyledSkeleton
              animation="wave"
              variant="text"
              width={80}
              height={20}
            />
          </AchievementCardLabel>
          <BaseStyledSkeleton
            animation="wave"
            variant="rectangular"
            width={62}
            height={40}
            sx={(theme) => ({
              borderRadius: theme.shape.borderRadius,
            })}
          />
        </AchievementCardContent>
      </AchievementCardActionArea>
    </AchievementCardContainer>
  );
};
