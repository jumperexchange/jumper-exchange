'use client';
import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import 'react-multi-carousel/lib/styles.css';
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

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1328,
    },
    items: 3,
    partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 600,
      min: 0,
    },
    items: 1,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1200,
      min: 600,
    },
    items: 1,
    // partialVisibilityGutter: 30
  },
};

export const BlogCarousel = ({ data, title }: BlogCarouselProps) => {
  const { t } = useTranslation();

  return (
    <Container
      sx={{
        position: 'relative',
      }}
    >
      <Carousel showDots={true} title="Recent Posts" responsive={responsive}>
        {data
          ? data.map((article, index) => (
              <div style={{ width: 'calc(416px + 32px)', margin: '0 16px' }}>
                <BlogArticleCard
                  article={article}
                  key={`blog-article-card-${article.id}-${index}`}
                  trackingCategory={TrackingCategory.BlogCarousel}
                />
              </div>
            ))
          : Array.from({ length: 4 }, () => 42).map((_, idx) => (
              <BlogArticleCardSkeleton key={'article-card-skeleton-' + idx} />
            ))}
      </Carousel>
    </Container>
  );
};
