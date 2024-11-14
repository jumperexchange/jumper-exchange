import { StyledLeaderboardEntry } from '../Leaderboard/Leaderboard.style';
import { NoSelectTypography } from '@/components/ProfilePage/ProfilePage.style';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { Box } from '@mui/material';

interface LeaderboardEntryProps {
  isUserPosition: boolean;
  walletAddress: string;
  position: number;
  points: number;
}

export const LeaderboardEntry = ({
  isUserPosition,
  walletAddress,
  position,
  points,
}: LeaderboardEntryProps) => {
  return (
    <StyledLeaderboardEntry isUserPosition={isUserPosition}>
      <NoSelectTypography
        fontSize="18px"
        lineHeight="18px"
        fontWeight={500}
        sx={{ opacity: '0.5', width: '25px' }}
      >
        {position}.
      </NoSelectTypography>
      <NoSelectTypography
        fontSize="18px"
        lineHeight="18px"
        fontWeight={600}
        sx={{ width: '110px' }}
      >
        {walletAddress}
      </NoSelectTypography>
      <Box display={'flex'} alignItems={'center'}>
        <NoSelectTypography
          fontSize="18px"
          lineHeight="18px"
          fontWeight={600}
          marginRight={'5px'}
        >
          {points}
        </NoSelectTypography>
        <XPIcon size={24} />
      </Box>
    </StyledLeaderboardEntry>
  );
};
