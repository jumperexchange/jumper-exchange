import { useNavigate } from 'react-router-dom';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import type { BlogArticleData } from 'src/types';
import { EventTrackingTool } from 'src/types';
import { handleNavigationIndex } from 'src/utils';
import {
  BlogHighlightsContent,
  BlogHighlightsImage,
  BlogHighlightsCard as Container,
} from '.';
import {
  BlogHighlightsSubtitle,
  BlogHighlightsTitle,
} from './BlogHighlightsCard.style';

interface BlogHighlightsCardProps {
  swipeDeltaX: number | null;
  activePost: number;
  articles: BlogArticleData[];
  index: number;
  source: BlogArticleData[];
  swipeHandlers: object;
  url: URL;
}

export const BlogHighlightsCard = ({
  swipeDeltaX,
  activePost,
  articles,
  index,
  source,
  swipeHandlers,
  url,
}: BlogHighlightsCardProps) => {
  const navigate = useNavigate();
  const { trackEvent } = useUserTracking();

  const handleImageClick = (index: number) => {
    if (!swipeDeltaX) {
      trackEvent({
        category: TrackingCategory.Menu,
        label: 'click-join-discord-community-button',
        action: TrackingAction.OpenMenu,
        data: { [TrackingEventParameter.Menu]: 'lifi_discord' },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
      navigate(`/blog/${articles[index].attributes.Slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Container
      key={`blog-highlights-${index}`}
      index={index}
      activePost={activePost}
      active={index === activePost}
      sx={{
        ...(swipeDeltaX !== null &&
          swipeDeltaX < 0 &&
          index ===
            handleNavigationIndex({
              direction: 'next',
              active: activePost,
              max: source.length,
            }) && {
            opacity: Math.abs(swipeDeltaX) / 250,
          }),
        ...(swipeDeltaX !== null &&
          swipeDeltaX > 0 &&
          index ===
            handleNavigationIndex({
              direction: 'prev',
              active: activePost,
              max: source.length,
            }) && {
            opacity: Math.abs(swipeDeltaX) / 250,
          }),
        ...(swipeDeltaX !== null &&
          swipeDeltaX < 0 &&
          index === activePost && {
            opacity: 1 - Math.abs(swipeDeltaX) / 250,
          }),
        ...(swipeDeltaX !== null &&
          swipeDeltaX > 0 &&
          index === activePost && {
            opacity: 1 - Math.abs(swipeDeltaX) / 250,
          }),
      }}
      container
      {...swipeHandlers}
    >
      <BlogHighlightsContent>
        <BlogHighlightsTitle variant="lifiHeaderMedium">
          {articles[index].attributes.Title}
        </BlogHighlightsTitle>
        <BlogHighlightsSubtitle>
          {articles[index].attributes.Subtitle}
        </BlogHighlightsSubtitle>
      </BlogHighlightsContent>
      <BlogHighlightsImage
        onClick={() => handleImageClick(index)}
        draggable={false}
        src={`${url.origin}${articles[index].attributes.Image.data.attributes.url}`}
        alt={articles[index].attributes.Image.data.attributes.alternativeText}
      />
    </Container>
  );
};
