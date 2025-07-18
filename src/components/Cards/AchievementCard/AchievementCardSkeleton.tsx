import { Skeleton } from '@mui/material';
import {
  AchievementCardActionArea,
  AchievementCardContainer,
  AchievementCardContent,
  AchievementCardLabel,
} from './AchievementCard.style';

export const AchievementCardSkeleton = () => {
  return (
    <AchievementCardContainer>
      <AchievementCardActionArea focusRipple={false} disabled>
        <Skeleton variant="rectangular" width={'100%'} height={320} />
        <AchievementCardContent>
          <AchievementCardLabel>
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={80} height={20} />
          </AchievementCardLabel>
          <Skeleton
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
