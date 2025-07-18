import { Skeleton } from '@mui/material';
import {
  AchievementCardActionArea,
  AchievementCardContent,
  AchievementCardLabel,
  AchievementCard as AchievementCardStyled,
} from './AchievementCard.style';

export const AchievementCardSkeleton = () => {
  return (
    <AchievementCardStyled>
      <AchievementCardActionArea focusRipple={false} disabled>
        <Skeleton variant="rectangular" width={296} height={320} />
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
    </AchievementCardStyled>
  );
};
