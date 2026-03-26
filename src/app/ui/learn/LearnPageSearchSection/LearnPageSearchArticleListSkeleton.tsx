import { BlogArticleCard } from '@/components/composite/cards/BlogArticleCard/BlogArticleCard';
import type { FC } from 'react';
import { LearnPageSearchArticleListShell } from './LearnPageSearchArticleListShell';

interface LearnPageSearchArticleListSkeletonProps {
  length?: number;
}

export const LearnPageSearchArticleListSkeleton: FC<
  LearnPageSearchArticleListSkeletonProps
> = ({ length = 2 }) => (
  <LearnPageSearchArticleListShell>
    {Array.from({ length }, (_, index) => (
      <BlogArticleCard key={index} variant="preview" isLoading />
    ))}
  </LearnPageSearchArticleListShell>
);
