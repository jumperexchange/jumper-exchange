import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticlesCollections } from 'src/components/Blog/BlogArticlesCollections/BlogArticlesCollections';

interface LearnPageProps {
  carouselArticles: StrapiResponse<BlogArticleData>;
  featuredArticle: BlogArticleData;
  tags: GetTagsResponse;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  tags,
}: LearnPageProps) => {
  return (
    <div className="learn-page">
      {featuredArticle && (
        <FeaturedArticle
          featuredArticle={featuredArticle}
          // handleFeatureCardClick={() =>
          //   handleFeatureCardClick(featuredArticle.data)
          // }
        />
      )}
      <BlogCarousel data={carouselArticles?.data} />
      <JoinDiscordBanner />
      <BlogArticlesCollections tags={tags.data} data={carouselArticles?.data} />
    </div>
  );
};

export default LearnPage;
