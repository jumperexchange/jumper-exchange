import { getSiteUrl } from '@/const/urls';
import { paginationSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import LeaderboardPage from 'src/app/ui/leaderboard/LeaderboardPage';
import { LeaderboardPageSkeleton } from '@/app/ui/leaderboard/LeaderboardPageSkeleton';

export const metadata: Metadata = {
  title: 'Jumper Leaderboard',
  description: 'Jumper Leaderboard is the profile page of Jumper.',
  alternates: {
    canonical: `${getSiteUrl()}/leaderboard`,
  },
};

type SearchParams = Promise<{ page: string | undefined }>;

async function LeaderboardLoader({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const result = paginationSchema.safeParse(page);
  const validatedPage = result.success ? result.data.toString() : '1';

  return <LeaderboardPage page={validatedPage} />;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<LeaderboardPageSkeleton />}>
      <LeaderboardLoader searchParams={searchParams} />
    </Suspense>
  );
}
