'use client';

import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { LearnPageArticlesSectionSkeleton } from './LearnPageArticlesSectionSkeleton';

const LearnPageArticlesSectionClient = dynamic(
  () =>
    import('./LearnPageArticlesSectionClient').then(
      (mod) => mod.LearnPageArticlesSectionClient,
    ),
  {
    ssr: false,
    loading: LearnPageArticlesSectionSkeleton,
  },
);

interface LearnPageArticlesSectionProps {}

export const LearnPageArticlesSection: FC<
  LearnPageArticlesSectionProps
> = ({}) => {
  return <LearnPageArticlesSectionClient />;
};
