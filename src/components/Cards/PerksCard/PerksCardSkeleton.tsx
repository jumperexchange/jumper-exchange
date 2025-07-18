import { Skeleton } from '@mui/material';
import {
  PerksCardActionArea,
  PerksCardBadgeContainer,
  PerksCardContainer,
  PerksCardContent,
} from './PerksCard.style';

export const PerksCardSkeleton = () => {
  return (
    <PerksCardContainer>
      <PerksCardActionArea focusRipple={false} disabled>
        <Skeleton variant="rectangular" width={'100%'} height={320} />
        <PerksCardContent>
          <Skeleton variant="text" width={'100%'} height={24} />
          <Skeleton variant="text" width={192} height={20} />
          <PerksCardBadgeContainer>
            <Skeleton
              variant="rectangular"
              width={64}
              height={40}
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
              })}
            />
            <Skeleton
              variant="rectangular"
              width={64}
              height={40}
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
              })}
            />
            <Skeleton
              variant="rectangular"
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
