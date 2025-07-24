import {
  BaseSkeleton,
  BaseStyledSkeleton,
  PerksCardActionArea,
  PerksCardBadgeContainer,
  PerksCardContainer,
  PerksCardContent,
} from './PerksCard.style';

export const PerksCardSkeleton = () => {
  return (
    <PerksCardContainer>
      <PerksCardActionArea focusRipple={false} disabled>
        <BaseSkeleton variant="rectangular" width={'100%'} height={320} />
        <PerksCardContent>
          <BaseStyledSkeleton
            variant="text"
            width={'100%'}
            height={24}
            animation="wave"
          />
          <BaseStyledSkeleton
            variant="text"
            width={192}
            height={20}
            animation="wave"
          />
          <PerksCardBadgeContainer>
            <BaseStyledSkeleton
              variant="rectangular"
              animation="wave"
              width={64}
              height={40}
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
              })}
            />
            <BaseStyledSkeleton
              variant="rectangular"
              animation="wave"
              width={64}
              height={40}
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
              })}
            />
            <BaseStyledSkeleton
              variant="rectangular"
              animation="wave"
              width={40}
              height={40}
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
              })}
            />
          </PerksCardBadgeContainer>
        </PerksCardContent>
      </PerksCardActionArea>
    </PerksCardContainer>
  );
};
