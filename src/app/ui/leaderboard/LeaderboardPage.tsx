'use client';
import { LeaderboardPage as LeaderboardPageComponent } from '@/components/Leaderboard/LeaderboardPage';

const LeaderboardPage = ({ page }: { page?: string }) => {
  const parsedPage = page ? parseInt(page, 10) : NaN;
  const defaultPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  return <LeaderboardPageComponent page={defaultPage} />;
};

export default LeaderboardPage;
