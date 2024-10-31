'use client';
import { LeaderboardPage as LeaderboardPageComponent } from '@/components/Leaderboard/LeaderboardPage';

const LeaderboardPage = ({ page }: { page: string }) => {
  return <LeaderboardPageComponent page={page} />;
};

export default LeaderboardPage;
