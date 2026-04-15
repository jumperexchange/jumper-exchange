'use client';

import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import Stack from '@mui/material/Stack';
import { LearnPageArticlesFilteringBarSkeleton } from './LearnPageArticlesFilteringBarSkeleton';
import { LearnPageArticlesList } from './LearnPageArticlesList';

export const LearnPageArticlesSectionSkeleton = () => {
  return (
    <SectionCard>
      <Stack
        direction="column"
        sx={{
          gap: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <LearnPageArticlesFilteringBarSkeleton />
        <LearnPageArticlesList loading items={[]} />
      </Stack>
    </SectionCard>
  );
};
