import { alpha, Box, Skeleton, useTheme } from '@mui/material';
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
  const theme = useTheme();

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
        <XPIcon
          size={24}
          color={theme.palette.primary.main}
          bgColor={
            theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.primary.main, 0.42)
          }
        />
      </RankPointsContainer>
    </LeaderboardEntryWrapper>
  );
};
