import { Box, Pagination, Stack, useTheme } from '@mui/material';
import { NoSelectTypography } from '../ProfilePage.style';
import { LeaderboardContainer } from './Leaderboard.style';
import { XPIcon } from '../../../components/illustrations/XPIcon';
import { useState } from 'react';


export const Leaderboard = () => {
  const theme = useTheme();

  const [entries, setEntries] = useState([
    {
      "id": "4583315b-5591-40c3-8877-ac0c94a00529",
      "walletAddress": "0x9f...aa4f",
      "points": "4996",
      "position": "1"
    },
    {
      "id": "211be472-5119-4deb-86ba-9ede41ee07c2",
      "walletAddress": "0xa3...307f",
      "points": "3797",
      "position": "2"
    },
    {
      "id": "f49e4f7a-04b8-49ef-82fa-8a82e877335d",
      "walletAddress": "0x0b...ec9e",
      "points": "3568",
      "position": "3"
    },
    {
      "id": "21065723-96b4-4fb3-85a5-43333159684d",
      "walletAddress": "0x5c...9eeb",
      "points": "3383",
      "position": "4"
    },
    {
      "id": "b10dfea4-3080-4dc1-9479-73c57545ae2e",
      "walletAddress": "0xd1...9b84",
      "points": "3238",
      "position": "5"
    },
    {
      "id": "df9b8ae9-16a4-498f-a563-2dbddfa208c9",
      "walletAddress": "0x4a...dfc6",
      "points": "3096",
      "position": "6"
    },
    {
      "id": "f92d044e-fa2f-48a9-9136-b5649cc0b207",
      "walletAddress": "0x53...edad",
      "points": "2814",
      "position": "7"
    },
    {
      "id": "21cc1edf-bbdd-4eac-ad7f-f2f6bb2d8152",
      "walletAddress": "0xae...6cfa",
      "points": "2766",
      "position": "8"
    },
    {
      "id": "16b2ac27-2dbd-432a-95a2-124f46122f87",
      "walletAddress": "0xb7...e43c",
      "points": "2495",
      "position": "9"
    },
    {
      "id": "fe55200f-3d2e-4311-993b-11fd221cec5b",
      "walletAddress": "0xbb...da26",
      "points": "2478",
      "position": "10"
    }
  ]);

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
        216,123
      </NoSelectTypography>
      <Stack direction={'column'} sx={{ margin: '20px 0' }}>
        {entries.map((entry, index) => (
          <Box key={index} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ width: '100%', margin: '10px 0' }}>
            <NoSelectTypography
              fontSize="18px"
              lineHeight="18px"
              fontWeight={500}
            >
              {entry.position}.
            </NoSelectTypography>
            <NoSelectTypography
              fontSize="18px"
              lineHeight="18px"
              fontWeight={600}
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
        ))}
      </Stack>
      <Box>
      <Pagination count={10} />
      {/* <Button
        aria-label={'1'}
        variant="secondary"
        size="medium"
        styles={{ alignItems: 'center', width: '100%' }}
      >
        <NoSelectTypography
          fontSize="16px"
          lineHeight="18px"
          fontWeight={600}
        >
          1
        </NoSelectTypography>
      </Button> */}
      </Box>
    </LeaderboardContainer>
  );
};
