import { Box, Skeleton } from '@mui/material';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import {
  LeaderboardEntryWrapper,
  RankLabelSkeleton,
  RankPointsContainer,
} from './LeaderboardEntry.style';

export const LeaderboardEntrySkeleton = ({
  isUserPosition = false,
}: {
  isUserPosition?: boolean;
}) => {
  return (
    <LeaderboardEntryWrapper isUserPosition={isUserPosition}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          minWidth={74}
          textAlign={'center'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <RankLabelSkeleton variant="rectangular" />
        </Box>
        <Skeleton
          animation="wave"
          variant="circular"
          width={48}
          height={48}
          sx={{ marginLeft: '24px' }}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={24}
          sx={{ minWidth: '160px', marginLeft: '32px', borderRadius: '12px' }}
        />
      </Box>
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
