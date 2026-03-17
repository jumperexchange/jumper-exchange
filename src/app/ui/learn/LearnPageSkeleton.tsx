'use client';

import Box from '@mui/material/Box';
import { LearnPageArticlesSectionSkeleton } from './LearnPageArticlesSection/LearnPageArticlesSectionSkeleton';
import { FeaturedArticleSkeleton } from '@/components/Blog/FeaturedArticle/FeaturedArticleSkeleton';

export const LearnPageSkeleton = () => {
  return (
    <Box
      className="learn-page"
      sx={{
        paddingBottom: {
          xs: 12,
          md: 0,
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <FeaturedArticleSkeleton />
      <LearnPageArticlesSectionSkeleton />
    </Box>
  );
};
