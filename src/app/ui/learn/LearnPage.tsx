import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import type {
  BlogArticleData,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import Box from '@mui/material/Box';
import { LearnPageBlogCarousel } from './LearnPageBlogCarousel';
import { LearnFilteringProvider } from '../../../providers/LearnProvider/filtering/LearnFilteringContext';
import { LearnPageArticlesSection } from './LearnPageArticlesSection/LearnPageArticlesSection';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';

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
      <LearnFilteringProvider tags={tags}>
        <LearnPageArticlesSection />
      </LearnFilteringProvider>
    </Box>
  );
};

export default LearnPage;
