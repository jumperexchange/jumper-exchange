'use client';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { JUMPER_LEARN_PATH, TrackingAction, TrackingCategory } from 'src/const';
import { EventTrackingTool, type BlogArticleData } from 'src/types';
import { CarouselContainer } from '.';
import { BlogArticleCard } from '../BlogArticleCard/BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import {
  BlogCarouselContainer,
  SeeAllButton,
  SeeAllButtonContainer,
} from './BlogCarousel.style';

interface BlogCarouselProps {
  showAllButton?: boolean;
  url: URL;
  title?: string;
  data: BlogArticleData[];
}

export const BlogCarousel = ({
  data,
  url,
  title,
  showAllButton,
}: BlogCarouselProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { trackEvent } = useUserTracking();

  console.log('BLOG CAROUSEL DATA', data);
  console.log('URL', url);

  const handleShowAll = () => {
    trackEvent({
      category: TrackingCategory.BlogCarousel,
      action: TrackingAction.SeeAllPosts,
      label: 'click-see-all-posts',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    router.push(JUMPER_LEARN_PATH);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BlogCarouselContainer>
      <CarouselContainer
        title={title}
        trackingCategory={TrackingCategory.BlogCarousel}
      >
        {data ? (
          data?.map((article, index) => {
            return (
              <BlogArticleCard
                id={article.id}
                baseUrl={url}
                trackingCategory={TrackingCategory.BlogCarousel}
                key={`blog-carousel-article-${article.id}-${index}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
                content={article.attributes.Content}
                publishedAt={article.attributes.publishedAt}
                createdAt={article.attributes.createdAt}
                tags={article.attributes.tags}
              />
            );
          })
        ) : (
          <>
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
          </>
        )}
      </CarouselContainer>
      {showAllButton ? (
        <SeeAllButtonContainer show={!!data?.length}>
          <SeeAllButton onClick={handleShowAll}>
            {t('blog.seeAllPosts')}
          </SeeAllButton>
        </SeeAllButtonContainer>
      ) : null}
    </BlogCarouselContainer>
  );
};
