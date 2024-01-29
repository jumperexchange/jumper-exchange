import type { CSSObject } from '@mui/material';
import { CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TrackingAction, TrackingEventParameter } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool, type StrapiImageData } from 'src/types';
import { BlogArticleCardContainer, BlogArticleCardImage } from '.';

interface BlogArticleCardProps {
  baseUrl: URL;
  id: number;
  image: StrapiImageData;
  title: string;
  trackingCategory: string;
  slug: string;
  styles?: CSSObject;
}

export const BlogArticleCard = ({
  baseUrl,
  trackingCategory,
  image,
  id,
  title,
  styles,
  slug,
}: BlogArticleCardProps) => {
  const navigate = useNavigate();
  const { trackEvent } = useUserTracking();

  const handleClick = () => {
    trackEvent({
      category: trackingCategory,
      action: TrackingAction.ClickArticleCard,
      label: 'click-blog-article-card',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleCardTitle]: title,
        [TrackingEventParameter.ArticleCardId]: id,
      },
    });
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <BlogArticleCardContainer
      variant="outlined"
      onClick={handleClick}
      sx={styles}
    >
      <BlogArticleCardImage
        src={`${baseUrl?.origin}${image.data.attributes.url}`}
        alt={image.data.attributes.alternativeText}
        draggable={false}
      />
      <CardContent>
        <Typography variant="lifiBodyLarge" sx={{ color: 'inherit' }}>
          {title}
        </Typography>
      </CardContent>
    </BlogArticleCardContainer>
  );
};
