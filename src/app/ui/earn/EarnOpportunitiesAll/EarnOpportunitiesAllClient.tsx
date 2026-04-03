'use client';

import dynamic from 'next/dynamic';
import type { FC } from 'react';

import type { EarnOpportunities } from '@/types/jumper-backend';

import { EarnOpportunitiesAllSkeleton } from './EarnOpportunitiesAllSkeleton';

const EarnOpportunitiesAll = dynamic(
  () =>
    import('./EarnOpportunitiesAll').then((mod) => mod.EarnOpportunitiesAll),
  {
    ssr: false,
    loading: () => <EarnOpportunitiesAllSkeleton />,
  },
);

export interface EarnOpportunitiesAllClientProps {
  initialAllOpportunities: EarnOpportunities;
}

/** Loads the earn list + nuqs on the client only so RSC never runs useSearchParams (no page-level Suspense / tab flash). */
export const EarnOpportunitiesAllClient: FC<
  EarnOpportunitiesAllClientProps
> = ({ initialAllOpportunities }) => (
  <EarnOpportunitiesAll initialAllOpportunities={initialAllOpportunities} />
);
