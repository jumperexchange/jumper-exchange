import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BlogArticleCard, Button, CarouselContainer } from 'src/components';
import { TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool, type BlogArticleData } from 'src/types';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';

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
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trackEvent } = useUserTracking();

  const handleShowAll = () => {
    trackEvent({
      category: TrackingCategory.BlogCarousel,
      action: TrackingAction.SeeAllPosts,
      label: 'click-see-all-posts',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('DATA', data);

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === 'light'
            ? '#F9F5FF'
            : theme.palette.surface1.main,
        padding: theme.spacing(8.5, 6),
        margin: theme.spacing(12, 8, 8),
        borderRadius: '32px',
      }}
    >
      {data?.length ? (
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
                  key={`blog-page-article-${index}`}
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
      ) : null}
      {showAllButton ? (
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          marginTop={!!data?.length ? 4 : 0}
        >
          <Button
            variant="secondary"
            onClick={handleShowAll}
            styles={{
              width: 320,
              margin: theme.spacing(0, 'auto', 4),
            }}
          >
            {t('blog.seeAllPosts')}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};
