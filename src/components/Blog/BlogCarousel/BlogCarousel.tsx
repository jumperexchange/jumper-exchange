'use client';
import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import { Carousel } from 'src/components/Carousel/Carousel';
import { DotsPagination } from 'src/components/Carousel/DotsPagination';
import { CarouselNavigation } from 'src/components/Carousel/Navigation';
import { TrackingCategory } from 'src/const/trackingKeys';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import { BlogCarouselContainer } from './BlogCarousel.style';

interface BlogCarouselProps {
  showAllButton?: boolean;
  title?: string;
  data: StrapiResponseData<BlogArticleData> | undefined;
}

export const BlogCarousel = ({ data, title }: BlogCarouselProps) => {
  return (
    <BlogCarouselContainer>
      <Carousel
        title={title}
        fixedSlideWidth={true}
        CarouselNavigation={CarouselNavigation}
        CarouselPagination={DotsPagination}
      >
        {data
          ? data.map((article, index) => (
              <BlogArticleCard
                article={article}
                key={`blog-article-card-${article.id}-${index}`}
                trackingCategory={TrackingCategory.BlogCarousel}
              />
            ))
          : Array.from({ length: 4 }).map((_, idx) => (
              <BlogArticleCardSkeleton key={'article-card-skeleton-' + idx} />
            ))}
      </Carousel>
    </BlogCarouselContainer>
  );
};
