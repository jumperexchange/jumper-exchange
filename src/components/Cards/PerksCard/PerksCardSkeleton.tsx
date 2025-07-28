import { FC } from 'react';
import { PERK_CARD_SIZES } from './constants';
import {
  BaseSkeleton,
  BaseStyledSkeleton,
  PerksCardActionArea,
  PerksCardBadgeContainer,
  PerksCardContainer,
  PerksCardContent,
} from './PerksCard.style';

interface PerksCardSkeletonProps {
  fullWidth?: boolean;
}

export const PerksCardSkeleton: FC<PerksCardSkeletonProps> = ({
  fullWidth,
}) => {
  return (
    <PerksCardContainer
      sx={{
        height: PERK_CARD_SIZES.CARD_HEIGHT,
        width: '100%',
        maxWidth: fullWidth ? '100%' : PERK_CARD_SIZES.CARD_WIDTH,
      }}
    >
      <PerksCardActionArea focusRipple={false} disabled>
        <BaseSkeleton
          variant="rectangular"
          width={'100%'}
          height={PERK_CARD_SIZES.IMAGE_HEIGHT}
        />
        <PerksCardContent>
          <BaseStyledSkeleton
            variant="text"
            width={'100%'}
            height={24}
            animation="wave"
          />
          <BaseStyledSkeleton
            variant="text"
            width={PERK_CARD_SIZES.CARD_WIDTH}
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
