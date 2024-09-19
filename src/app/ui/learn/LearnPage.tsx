import type { GetArticlesResponse } from '@/app/lib/getArticles';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';

interface LearnPageProps {
  carouselArticles: GetArticlesResponse;
  featuredArticle: StrapiResponse<BlogArticleData>;
  url: string;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  url,
}: LearnPageProps) => {
  return (
    <div className="learn-page">
      {featuredArticle.data?.[0] && (
        <FeaturedArticle
          url={url}
          featuredArticle={featuredArticle.data[0]}
          // handleFeatureCardClick={() =>
          //   handleFeatureCardClick(featuredArticle.data)
          // }
        />
      )}
      <BlogCarousel url={url} data={carouselArticles?.data} />
      <JoinDiscordBanner />
    </div>
  );
};

export default LearnPage;
