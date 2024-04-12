import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { GetArticlesResponse } from 'src/app/lib/getArticles';

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
    <>
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
    </>
  );
};

export default LearnPage;
