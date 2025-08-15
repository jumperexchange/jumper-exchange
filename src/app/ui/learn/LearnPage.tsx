'use client';

import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import type {
  BlogArticleData,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import { LearnPageClient } from './LearnPageClient';
import Box from '@mui/material/Box';

interface LearnPageProps {
  carouselArticles: StrapiResponse<BlogArticleData>;
  featuredArticle: BlogArticleData;
  tags: StrapiResponse<TagAttributes>;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  tags,
}: LearnPageProps) => {
  return (
    <Box
      className="learn-page"
      sx={{
        paddingBottom: {
          xs: 12,
          md: 0,
        },
      }}
    >
      {featuredArticle && (
        <FeaturedArticle
          featuredArticle={featuredArticle}
          // handleFeatureCardClick={() =>
          //   handleFeatureCardClick(featuredArticle.data)
          // }
        />
      )}
      <LearnPageClient carouselArticles={carouselArticles} tags={tags} />
    </Box>
  );
};

export default LearnPage;
