'use client';

import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import type {
  BlogArticleData,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import { LearnPageClient } from './LearnPageClient';

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
      <LearnPageClient carouselArticles={carouselArticles} tags={tags} />
    </div>
  );
};

export default LearnPage;
