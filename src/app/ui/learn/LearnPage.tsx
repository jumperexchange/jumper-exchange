import type { GetArticlesResponse } from '@/app/lib/getArticles';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticlesCollections } from 'src/components/Blog/BlogArticlesCollections/BlogArticlesCollections';

interface LearnPageProps {
  carouselArticles: GetArticlesResponse;
  featuredArticle: BlogArticleData;
  url: string;
  tags: GetTagsResponse;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  tags,
  url,
}: LearnPageProps) => {
  return (
    <div className="learn-page">
      {featuredArticle && (
        <FeaturedArticle
          url={url}
          featuredArticle={featuredArticle}
          // handleFeatureCardClick={() =>
          //   handleFeatureCardClick(featuredArticle.data)
          // }
        />
      )}
      <BlogCarousel url={url} data={carouselArticles?.data} />
      <JoinDiscordBanner />
      <BlogArticlesCollections tags={tags.data} data={carouselArticles?.data} />
    </div>
  );
};

export default LearnPage;
