import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type {
  BlogArticleData,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import { BlogArticlesCollections } from 'src/components/Blog/BlogArticlesCollections/BlogArticlesCollections';
import { BlogCarousel } from 'src/components/Blog/BlogCarousel/BlogCarousel';

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
      {/* <CarouselTest data={carouselArticles?.data}/> */}
      <JoinDiscordBanner />
      <BlogArticlesCollections tags={tags.data} data={carouselArticles?.data} />
    </div>
  );
};

export default LearnPage;
