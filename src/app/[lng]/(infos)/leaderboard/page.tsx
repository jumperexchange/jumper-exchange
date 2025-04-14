import { getSiteUrl } from '@/const/urls';
import { paginationSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import LeaderboardPage from 'src/app/ui/leaderboard/LeaderboardPage';

export const metadata: Metadata = {
  title: 'Jumper Leaderboard',
  description: 'Jumper Leaderboard is the profile page of Jumper Exchange.',
  alternates: {
    canonical: `${getSiteUrl()}/leaderboard`,
  },
};

type SearchParams = { page: string | undefined };

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = searchParams;

  // Validate and transform page number
  const result = paginationSchema.safeParse(page);
  const validatedPage = result.success ? result.data.toString() : '1';

  return <LeaderboardPage page={validatedPage} />;
}
