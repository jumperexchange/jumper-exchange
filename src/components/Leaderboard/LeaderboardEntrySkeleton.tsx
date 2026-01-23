import { Skeleton } from '@mui/material';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import {
  LeaderboardEntryInfos,
  LeaderboardEntryWrapper,
  RankLabelSkeleton,
  RankPointsContainer,
  RankWalletImageSkeleton,
} from './LeaderboardEntry.style';

export const LeaderboardEntrySkeleton = ({
  isUserPosition = false,
}: {
  isUserPosition?: boolean;
}) => {
  return (
    <LeaderboardEntryWrapper isUserPosition={isUserPosition}>
      <LeaderboardEntryInfos>
        <RankLabelSkeleton variant="rectangular" />
        <RankWalletImageSkeleton animation="wave" variant="circular" />
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={24}
          sx={(theme) => ({
            minWidth: '160px',
            borderRadius: theme.shape.radius12,
          })}
        />
      </LeaderboardEntryInfos>
      <RankPointsContainer>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={48}
          height={24}
          sx={(theme) => ({ borderRadius: theme.shape.radius12 })}
        />
        <XPIcon />
      </RankPointsContainer>
    </LeaderboardEntryWrapper>
  );
};
