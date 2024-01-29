import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BlogArticleCard, Button, SlideshowContainer } from 'src/components';
import { TrackingAction, TrackingCategory } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool, type BlogArticleData } from 'src/types';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';

interface BlogSlideshowProps {
  showAllButton?: boolean;
  url: URL;
  title?: string;
  data: BlogArticleData[];
}

export const BlogSlideshow = ({
  data,
  url,
  title,
  showAllButton,
}: BlogSlideshowProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trackEvent } = useUserTracking();

  const handleShowAll = () => {
    trackEvent({
      category: TrackingCategory.BlogSlideshow,
      action: TrackingAction.SeeAllPosts,
      label: 'click-see-all-posts',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return data ? (
    <Box
      sx={{
        backgroundColor: theme.palette.surface1.main,
        padding: theme.spacing(8, 1, 4),
      }}
    >
      <SlideshowContainer title={title}>
        {data ? (
          data?.map((article, index) => {
            return (
              <BlogArticleCard
                id={article.id}
                baseUrl={url}
                trackingCategory={TrackingCategory.BlogSlideshow}
                key={`blog-page-article-${index}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
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
      </SlideshowContainer>
      {showAllButton ? (
        <Box width="100%" display="flex" justifyContent="center" marginTop={4}>
          <Button
            variant="secondary"
            onClick={handleShowAll}
            styles={{
              width: '320px',
              margin: theme.spacing(0, 'auto', 4),
            }}
          >
            {t('blog.seeAllPosts')}
          </Button>
        </Box>
      ) : null}
    </Box>
  ) : null;
};
