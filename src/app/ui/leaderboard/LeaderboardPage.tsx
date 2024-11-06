'use client';
import { LeaderboardPage as LeaderboardPageComponent } from '@/components/Leaderboard/LeaderboardPage';

const LeaderboardPage = ({ page }: { page?: string }) => {
  const defaultPage =
    page && !isNaN(parseInt(page)) && parseInt(page) >= 1 ? parseInt(page) : 1;
  return <LeaderboardPageComponent page={defaultPage} />;
};

export default LeaderboardPage;
