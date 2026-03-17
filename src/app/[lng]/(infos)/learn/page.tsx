import LearnPage from '@/app/ui/learn/LearnPage';
import { LearnPageSkeleton } from '@/app/ui/learn/LearnPageSkeleton';
import { PageContainer } from '@/components/Containers/PageContainer';
import { getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Jumper Learn',
  description: 'Jumper Learn is the blog of Jumper.',
  alternates: {
    canonical: `${getSiteUrl()}/learn`,
  },
};

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page() {
  // TODO: make this component client side by removing async, a hook should do the job, will permit us to pre-render the pages

  return (
    <PageContainer>
      <Suspense fallback={<LearnPageSkeleton />}>
        <LearnPage />
      </Suspense>
    </PageContainer>
  );
}
