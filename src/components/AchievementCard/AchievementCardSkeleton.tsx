import {
  AchievementCardActionArea,
  AchievementCardContent,
  AchievementCardLabel,
  AchievementCard as AchievementCardStyled,
  VoidIcon,
} from './AchievementCard.style';

import { Box, Skeleton } from '@mui/material';

export const AchievementCardSkeleton = ({
  isVoidCard,
}: {
  isVoidCard?: boolean;
}) => {
  return (
    <AchievementCardStyled>
      <AchievementCardActionArea focusRipple={false} disabled>
        {isVoidCard ? (
          <AchievementCardVoidImage />
        ) : (
          <Skeleton variant="rectangular" width={296} height={320} />
        )}
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

const AchievementCardVoidImage = () => (
  <Box
    sx={(theme) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (theme.vars || theme).palette.text.primary,
      opacity: 0.04,
      height: 320,
      width: 296,
    })}
  >
    <VoidIcon />
  </Box>
);
