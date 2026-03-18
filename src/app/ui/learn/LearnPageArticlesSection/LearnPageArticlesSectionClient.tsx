'use client';

import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import type { FC } from 'react';
import { useLearnFiltering } from '../../../../providers/LearnProvider/filtering/LearnFilteringContext';
import Stack from '@mui/material/Stack';
import { LearnPageArticlesPagination } from './LearnPageArticlesPagination';
import { LearnPageArticlesFilteringBar } from './LearnPageArticlesFilteringBar';
import { LearnPageArticlesList } from './LearnPageArticlesList';

interface LearnPageArticlesSectionClientProps {}

export const LearnPageArticlesSectionClient: FC<
  LearnPageArticlesSectionClientProps
> = () => {
  const { data } = useLearnFiltering();

  return (
    <>
      <SectionCard>
        <Stack
          direction="column"
          gap={{
            xs: 2,
            md: 3,
          }}
        >
          <LearnPageArticlesFilteringBar />
          <LearnPageArticlesList items={data} />
          <LearnPageArticlesPagination />
        </Stack>
      </SectionCard>
    </>
  );
};
