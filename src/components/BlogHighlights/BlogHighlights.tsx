import type { CSSObject } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  STRAPI_BLOG_ARTICLES,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useStrapi, useUserTracking } from 'src/hooks';
import { EventTrackingTool, type BlogArticleData } from 'src/types';
import type { HandleNavigationIndexProps } from 'src/utils';
import { handleNavigationIndex } from 'src/utils';
import { BlogHighlightsSkeleton, BlogHightsContainer } from '.';
import { BlogHighlightsCard } from './BlogHighlightsCard';
import { Pagination } from './Pagination';

interface BlogHighlightsProps {
  styles?: CSSObject;
}

const maxHighlights = 5;

export const BlogHighlights = ({ styles }: BlogHighlightsProps) => {
  const [activePost, setActivePost] = useState<number>(0);
  const [swipeDeltaX, setSwipeDeltaX] = useState<number | null>(0);
  const { trackEvent } = useUserTracking();

  const { data: blogArticles, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles'],
  });

  const maxItems = useMemo(
    () =>
      blogArticles?.length > maxHighlights
        ? maxHighlights
        : blogArticles?.length,
    [blogArticles],
  );

  const handlePagination = useCallback(
    ({ direction, active, max }: HandleNavigationIndexProps) => {
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
      const newItem = handleNavigationIndex({
        direction,
        active,
        max,
      });
      newItem !== undefined && setActivePost(newItem);
    },
    [trackEvent],
  );

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipeDeltaX(eventData.deltaX);
    },
    onSwipedLeft: ({ deltaX }) => {
      const output = handlePagination({
        direction: 'next',
        active: activePost,
        max: maxItems,
      });
      trackEvent({
        category: TrackingCategory.BlogHighlights,
        label: 'swipe-blog-highlights-left',
        action: TrackingAction.SwipeHighlightCard,
        data: {
          [TrackingEventParameter.Pagination]: output,
          [TrackingEventParameter.SwipeDirection]: 'left',
        },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
      return output;
    },
    onSwipedRight: () => {
      const output = handlePagination({
        direction: 'prev',
        active: activePost,
        max: maxItems,
      });
      trackEvent({
        category: TrackingCategory.BlogHighlights,
        label: 'swipe-blog-highlights-right',
        action: TrackingAction.SwipeHighlightCard,
        data: {
          [TrackingEventParameter.Pagination]: output,
          [TrackingEventParameter.SwipeDirection]: 'right',
        },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
      return output;
    },
    onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
    onTouchEndOrOnMouseUp: () => setSwipeDeltaX(null),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <BlogHightsContainer>
      {blogArticles ? (
        blogArticles.map((el, index, source) => {
          return (
            index < maxItems && (
              <BlogHighlightsCard
                swipeDeltaX={swipeDeltaX}
                activePost={activePost}
                articles={blogArticles}
                index={index}
                source={source}
                swipeHandlers={swipeHandlers}
                url={url}
              />
            )
          );
        })
      ) : (
        <BlogHighlightsSkeleton />
      )}
      <Pagination
        articles={blogArticles}
        activePost={activePost}
        handlePagination={handlePagination}
        setActivePost={setActivePost}
        maxItems={maxItems}
        swipeDeltaX={swipeDeltaX}
      />
    </BlogHightsContainer>
  );
};
