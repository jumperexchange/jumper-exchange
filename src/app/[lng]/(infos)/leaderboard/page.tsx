import type { Metadata } from 'next';
import LeaderboardPage from 'src/app/ui/leaderboard/LeaderboardPage';

export const metadata: Metadata = {
  title: 'Jumper Leaderboard',
  description: 'Jumper Leaderboard is the profile page of Jumper Exchange.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/leaderboard`,
  },
};

export default async function Page({ params }: { params: { page: string } }) {
  // console.log('params', params);
  return <LeaderboardPage page={params.page} />;
}
