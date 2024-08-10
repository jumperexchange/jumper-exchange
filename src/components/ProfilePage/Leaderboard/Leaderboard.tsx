import { Box, Stack, useTheme } from '@mui/material';
import { NoSelectTypography } from '../ProfilePage.style';
import { LeaderboardContainer } from './Leaderboard.style';
import { XPIcon } from '../../../components/illustrations/XPIcon';
import { useLeaderboardList, useLeaderboardUser } from '../../../hooks/useLeaderboard';
import { Button } from '../../../components/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { useEffect, useState } from 'react';
import { LeaderboardSkeleton } from './LeaderboardSkeleton';

const LEADERBOARD_LENGTH = 25;

export const Leaderboard = ({ address }: { address?: string }) => {
  const theme = useTheme();
  
  const [currentPage, setCurrentPage] = useState(1);
  const { data: leaderboardData, isLoading, meta } = useLeaderboardList(currentPage, LEADERBOARD_LENGTH);
  const { data: leaderboardUserData } = useLeaderboardUser(address);

  const leaderboardListLength = meta?.pagination?.pagesLength || LEADERBOARD_LENGTH;

  useEffect(() => {
    setCurrentPage(current => Math.min(Math.max(current, 1), leaderboardListLength));
  }, [leaderboardListLength]);

  const nextPage = () => {
    setCurrentPage(current => Math.min(current + 1, leaderboardListLength));
  };
  
  const previousPage = () => {
    setCurrentPage(current => Math.max(current - 1, 1));
  };

  return (
    <LeaderboardContainer>
      <NoSelectTypography fontSize="14px" lineHeight="18px" fontWeight={700}>
        RANK
      </NoSelectTypography>
      <NoSelectTypography
        color={theme.palette.mode === 'light' ? theme.palette.accent1.main : theme.palette.white.main}
        fontWeight={700}
        sx={{ fontSize: { xs: 28, sm: 48 } }}
      >
        {leaderboardUserData ? leaderboardUserData.position : '-'}
      </NoSelectTypography>
      <Stack direction={'column'} sx={{ margin: '20px 0' }}>
        {isLoading ? <LeaderboardSkeleton />
          : leaderboardData?.map((entry: any, index: number) => (
            <Box key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ width: '100%', margin: '10px 0' }}>
              <NoSelectTypography fontSize="18px" lineHeight="18px" fontWeight={500} sx={{ opacity: '0.5', width: '25px' }}>
                {entry.position}.
              </NoSelectTypography>
              <NoSelectTypography fontSize="18px" lineHeight="18px" fontWeight={600} sx={{ width: '110px' }}>
                {entry.walletAddress}
              </NoSelectTypography>
              <Box display={'flex'} alignItems={'center'}>
                <NoSelectTypography fontSize="18px" lineHeight="18px" fontWeight={600} marginRight={'5px'}>
                  {entry.points}
                </NoSelectTypography>
                <XPIcon size={24} />
              </Box>
            </Box>
          ))}
      </Stack>
      {leaderboardListLength > 1 && <Box>
        <Button
          aria-label="Page Navigation"
          variant="secondary"
          size="medium"
          styles={{ alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}
        >
          <ChevronLeft onClick={previousPage} sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
          <NoSelectTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
            {currentPage}/{leaderboardListLength}
          </NoSelectTypography>
          <ChevronRight onClick={nextPage} sx={{ cursor: 'pointer', pointerEvents: 'auto' }} />
        </Button>
      </Box>}
    </LeaderboardContainer>
  );
};
