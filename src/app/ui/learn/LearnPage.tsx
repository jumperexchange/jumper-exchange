import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import Box from '@mui/material/Box';
import { LearnPageBlogCarousel } from './LearnPageBlogCarousel';
import { LearnFilteringProvider } from '../../../providers/LearnProvider/filtering/LearnFilteringContext';
import { LearnPageArticlesSection } from './LearnPageArticlesSection/LearnPageArticlesSection';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import { getFeaturedArticle } from '@/app/lib/getFeaturedArticle';
import { getArticles } from '@/app/lib/getArticles';
import { getTags } from '@/app/lib/getTags';
import { Suspense } from 'react';
import { LearnPageArticlesSectionSkeleton } from './LearnPageArticlesSection/LearnPageArticlesSectionSkeleton';

interface LearnPageProps {}

const LearnPage = async ({}: LearnPageProps) => {
  const featuredArticle = (await getFeaturedArticle()).data?.[0];
  const [carouselArticles, tags] = await Promise.all([
    getArticles(featuredArticle?.id, 5),
    getTags(),
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
      {featuredArticle && (
        <FeaturedArticle
          featuredArticle={featuredArticle}
          // handleFeatureCardClick={() =>
          //   handleFeatureCardClick(featuredArticle.data)
          // }
        />
      )}
      <LearnPageBlogCarousel articles={carouselArticles?.data} />
      <JoinDiscordBanner sx={{ margin: '0 !important' }} />
      <Suspense fallback={<LearnPageArticlesSectionSkeleton />}>
        <LearnFilteringProvider tags={tags}>
          <LearnPageArticlesSection />
        </LearnFilteringProvider>
      </Suspense>
    </Box>
  );
};

export default LearnPage;
