// import type { GetArticlesResponse } from '@/app/lib/getArticles';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData } from '@/types/strapi';
import type { StrapiResponse } from 'strapi-sdk-js';

interface LearnPageProps {
  carouselArticles: StrapiResponse<BlogArticleData[]>;
  featuredArticle: StrapiResponse<BlogArticleData[]>;
  url: string;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  url,
}: LearnPageProps) => {
  return (
    <div className="learn-page">
      <FeaturedArticle
        url={url}
        featuredArticle={featuredArticle.data}
        // handleFeatureCardClick={() =>
        //   handleFeatureCardClick(featuredArticle.data)
        // }
      />
      <BlogCarousel url={url} data={carouselArticles?.data} />
      <JoinDiscordBanner />
      {/* <BlogArticlesBoard /> */}
    </div>
  );
};

export default LearnPage;
