import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import Box from '@mui/material/Box';
import { LearnPageBlogCarousel } from './LearnPageBlogCarousel';
import { LearnFilteringProvider } from '../../../providers/LearnProvider/filtering/LearnFilteringContext';
import { LearnPageArticlesSection } from './LearnPageArticlesSection/LearnPageArticlesSection';
import { getFeaturedArticle } from '@/app/lib/getFeaturedArticle';
import { getArticles } from '@/app/lib/getArticles';
import { getTags } from '@/app/lib/getTags';
import type { FC } from 'react';
import { Suspense } from 'react';
import { LearnPageArticlesSectionSkeleton } from './LearnPageArticlesSection/LearnPageArticlesSectionSkeleton';
import { BlogArticleBanner } from '@/components/Blog/BlogArticleBanner/BlogArticleBanner';
import { LearnPageSearchSection } from './LearnPageSearchSection/LearnPageSearchSection';

interface LearnPageProps {}

const LearnPage: FC<LearnPageProps> = async () => {
  const featuredArticle = (
    await getFeaturedArticle().catch(() => ({ data: [] }))
  ).data?.[0];
  const [carouselArticles, tags] = await Promise.all([
    getArticles(featuredArticle?.id, 5).catch(() => ({ data: [] })),
    getTags().catch(() => ({
      data: [],
      meta: {
        pagination: {
          page: 0,
          pageSize: 0,
          pageCount: 0,
          total: 0,
        },
      },
    })),
  ]);

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
      <LearnPageSearchSection />
      {featuredArticle && (
        <FeaturedArticle
          featuredArticle={featuredArticle}
          // handleFeatureCardClick={() =>
          //   handleFeatureCardClick(featuredArticle.data)
          // }
        />
      )}
      <LearnPageBlogCarousel articles={carouselArticles?.data} />
      <BlogArticleBanner />
      <Suspense fallback={<LearnPageArticlesSectionSkeleton />}>
        <LearnFilteringProvider tags={tags}>
          <LearnPageArticlesSection />
        </LearnFilteringProvider>
      </Suspense>
    </Box>
  );
};

export default LearnPage;
