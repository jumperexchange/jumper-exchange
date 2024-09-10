import type { GetArticlesResponse } from '@/app/lib/getArticles';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticlesBoard } from 'src/components/Blog/BlogArticlesBoard/BlogArticlesBoard';

interface LearnPageProps {
  carouselArticles: GetArticlesResponse;
  featuredArticle: StrapiResponse<BlogArticleData>;
  url: string;
  tags: GetTagsResponse;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  tags,
  url,
}: LearnPageProps) => {
  console.log('TAGS', tags);
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
      <BlogArticlesBoard tags={tags} data={carouselArticles?.data} url={''} />
    </div>
  );
};

export default LearnPage;
