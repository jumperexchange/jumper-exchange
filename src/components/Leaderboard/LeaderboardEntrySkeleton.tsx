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
          sx={{ minWidth: '160px', borderRadius: '12px' }}
        />
      </LeaderboardEntryInfos>
      <RankPointsContainer>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={48}
          height={24}
          sx={{ borderRadius: '12px' }}
        />
        <XPIcon size={24} />
      </RankPointsContainer>
    </LeaderboardEntryWrapper>
  );
};
