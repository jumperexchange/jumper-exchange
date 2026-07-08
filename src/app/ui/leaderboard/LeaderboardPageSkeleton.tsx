'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { PageContainer } from '@/components/ProfilePage/ProfilePage.style';
import { LEADERBOARD_LENGTH } from '@/components/Leaderboard/Leaderboard';
import { LeaderboardEntrySkeleton } from '@/components/Leaderboard/LeaderboardEntrySkeleton';
import {
  LeaderboardContainer,
  LeaderboardEntryDivider,
  LeaderboardEntryStack,
  LeaderboardHeader,
  LeaderboardTitleBox,
} from '@/components/Leaderboard/Leaderboard.style';

export const LeaderboardPageSkeleton = () => {
  return (
    <PageContainer>
      <LeaderboardContainer>
        <LeaderboardHeader>
          <LeaderboardTitleBox>
            <Skeleton
              variant="rounded"
              width={200}
              height={32}
              sx={(theme) => ({ borderRadius: theme.shape.radius8 })}
            />
          </LeaderboardTitleBox>
        </LeaderboardHeader>
        <LeaderboardEntrySkeleton isUserPosition />
        <LeaderboardEntryStack direction="column">
          {Array.from({ length: LEADERBOARD_LENGTH }).map((_, index) => (
            <Box key={`leaderboard-skeleton-entry-${index}`}>
              <LeaderboardEntrySkeleton />
              {index !== LEADERBOARD_LENGTH - 1 && <LeaderboardEntryDivider />}
            </Box>
          ))}
        </LeaderboardEntryStack>
      </LeaderboardContainer>
    </PageContainer>
  );
};
