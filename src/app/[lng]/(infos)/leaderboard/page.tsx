import type { Metadata } from 'next';
import LeaderboardPage from 'src/app/ui/leaderboard/LeaderboardPage';

export const metadata: Metadata = {
  title: 'Jumper Leaderboard',
  description: 'Jumper Leaderboard is the profile page of Jumper Exchange.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/leaderboard`,
  },
};

type SearchParams = { page: string | undefined };

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams

  return <LeaderboardPage page={page} />;
}
