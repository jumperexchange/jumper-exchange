import { Box, Pagination, Stack, useTheme } from '@mui/material';
import { NoSelectTypography } from '../ProfilePage.style';
import { LeaderboardContainer } from './Leaderboard.style';
import { XPIcon } from '../../../components/illustrations/XPIcon';
import { useLeaderboardList, useLeaderboardUser } from 'src/hooks/useLeaderboard';
import { Button } from '../../../components/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';


export const Leaderboard = ({ address }: { address?: string }) => {
  const theme = useTheme();
  
  const { data: leaderboardListData }: any = useLeaderboardList(1,25);
  const { data: leaderboardUserData }: any = useLeaderboardUser('0xdbb6d1b6bceba6afc0dfdc44fb2d8afb0ce21c41');

  return (
    <LeaderboardContainer>
      <NoSelectTypography
        fontSize="14px"
        lineHeight="18px"
        fontWeight={700}
      >
        RANK
      </NoSelectTypography>
      <NoSelectTypography
        color={
          theme.palette.mode === 'light'
            ? theme.palette.accent1.main
            : theme.palette.white.main
        }
        fontWeight={700}
        sx={{
          fontSize: { xs: 28, sm: 48 },
        }}
      >
        {leaderboardUserData ? leaderboardUserData.position : '-'}
      </NoSelectTypography>
      <Stack direction={'column'} sx={{ margin: '20px 0' }}>
        {leaderboardListData ?
        leaderboardListData.map((entry: any, index: number) => (
          <Box key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ width: '100%', margin: '10px 0' }}>
            <NoSelectTypography
              fontSize="18px"
              lineHeight="18px"
              fontWeight={500}
              sx={{ opacity: '0.5', width: '25px' }}
            >
              {entry.position}.
            </NoSelectTypography>
            <NoSelectTypography
              fontSize="18px"
              lineHeight="18px"
              fontWeight={600}
              sx={{ width: '110px' }}
            >
              {entry.walletAddress}
            </NoSelectTypography>
            <Box display={'flex'} alignItems={'center'}>
            <NoSelectTypography
              fontSize="18px"
              lineHeight="18px"
              fontWeight={600}
              marginRight={'5px'}
            >
              {entry.points}
            </NoSelectTypography>
            <XPIcon size={24} />
            </Box>
          </Box>
        ))
        : 'Loading...'}
      </Stack>
      <Box>
      <Button
        aria-label={'1'}
        variant="secondary"
        size="medium"
        styles={{ alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}
      >
        <ChevronLeft sx={{ pointerEvents: 'auto' }} />
        <NoSelectTypography
          fontSize="16px"
          lineHeight="18px"
          fontWeight={600}
        >
          1/24
        </NoSelectTypography>
        <ChevronRight sx={{ pointerEvents: 'auto' }} />
      </Button>
      </Box>
    </LeaderboardContainer>
  );
};
