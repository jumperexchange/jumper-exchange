'use client';
import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import { Carousel } from 'src/components/Carousel/Carousel';
import { Container } from 'src/components/Container/Container';
import { TrackingCategory } from 'src/const/trackingKeys';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';

interface BlogCarouselProps {
  showAllButton?: boolean;
  title?: string;
  data: StrapiResponseData<BlogArticleData> | undefined;
}

export const BlogCarousel = ({ data, title }: BlogCarouselProps) => {
  return (
    <Container
      sx={{
        position: 'relative',
      }}
    >
      <Carousel showDots={true} title="Recent Posts" fixedItemWidth={true}>
        {data
          ? data.map((article, index) => (
              // <div style={{ width: 'calc(416px + 32px)', margin: '0 16px' }}>
              <BlogArticleCard
                article={article}
                key={`blog-article-card-${article.id}-${index}`}
                trackingCategory={TrackingCategory.BlogCarousel}
              />
              // </div>
            ))
          : Array.from({ length: 4 }, () => 42).map((_, idx) => (
              <BlogArticleCardSkeleton key={'article-card-skeleton-' + idx} />
            ))}
      </Carousel>
    </Container>
  );
};
