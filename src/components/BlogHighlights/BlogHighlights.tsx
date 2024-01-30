import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import {
  BlogHighlightsCard,
  BlogHighlightsContent,
  BlogHighlightsImage,
  BlogHightsContainer,
  Circle,
  SkeletonCircle,
} from '.';
import { Button } from '../Button';

interface BlogHighlightsProps {
  styles?: CSSObject;
}

const maxHighlights = 5;

export const BlogHighlights = ({ styles }: BlogHighlightsProps) => {
  const [activePost, setActivePost] = useState<number>(0);
  const [swipeDeltaX, setSwipeDeltaX] = useState<number | null>(0);
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trackEvent } = useUserTracking();

  const handleChange = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    // Access data attributes from the clicked element
    const index = event.currentTarget.getAttribute('data-index');

    // Log the data attributes
    !!index && setActivePost(parseInt(index));
  };

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
      navigate(`/blog/${blogArticles[index].attributes.Slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleButtonClick = (index: number) => {
    navigate(`/blog/${blogArticles[index].attributes.Slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  };

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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!!blogArticles.length) {
        switch (event.keyCode) {
          case 13: // Enter key
            // console.log('Enter key pressed!', activePost && true);
            activePost &&
              navigate(`/blog/${blogArticles[activePost].attributes.Slug}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 39: // Right arrow key
            // console.log('Right arrow key pressed!', activePost && true);
            handlePagination({
              direction: 'next',
              active: activePost,
              max: maxItems,
            });
            break;
          case 37: // Left arrow key
            // console.log('Left arrow key pressed!', activePost && true);
            handlePagination({
              direction: 'prev',
              active: activePost,
              max: maxItems,
            });
            break;
          default:
            // Handle other keys
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [activePost, blogArticles, handlePagination, maxItems, navigate]);

  return (
    <BlogHightsContainer>
      {blogArticles ? (
        blogArticles.map((el, index, source) => {
          return (
            index < maxItems && (
              <BlogHighlightsCard
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
                  <Typography
                    variant="lifiHeaderMedium"
                    sx={{
                      userSelect: 'none',
                      marginBottom: theme.spacing(2),
                      marginTop: theme.spacing(2),
                      maxHeight: 156,
                      overflow: 'hidden',
                      [theme.breakpoints.up('sm' as Breakpoint)]: {
                        marginTop: theme.spacing(2),
                      },
                      [theme.breakpoints.up('md' as Breakpoint)]: {
                        marginTop: theme.spacing(0),
                      },
                    }}
                  >
                    {blogArticles[index].attributes.Title}
                  </Typography>
                  <Typography
                    sx={{
                      userSelect: 'none',
                      marginBottom: theme.spacing(3),
                      maxHeight: 172,
                      overflow: 'hidden',
                    }}
                  >
                    {blogArticles[index].attributes.Subtitle}
                  </Typography>
                </BlogHighlightsContent>
                <BlogHighlightsImage
                  onClick={() => handleImageClick(index)}
                  draggable={false}
                  src={`${url.origin}${blogArticles[index].attributes.Image.data.attributes.url}`}
                  alt={
                    blogArticles[index].attributes.Image.data.attributes
                      .alternativeText
                  }
                />
              </BlogHighlightsCard>
            )
          );
        })
      ) : (
        <BlogHighlightsCard key={`blog-highlights-skeleton`} container>
          <BlogHighlightsContent>
            <Skeleton
              variant="text"
              sx={{
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
                height: 120,
                [theme.breakpoints.up('md' as Breakpoint)]: {
                  marginTop: theme.spacing(0),
                },
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                marginBottom: theme.spacing(3),
                height: 72,
              }}
            />
          </BlogHighlightsContent>
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: '14px',
              height: 300,
              gridRow: '1',
              gridColumn: '1 / span 2',
              width: '100%',
              [theme.breakpoints.up('md' as Breakpoint)]: {
                gridRow: '1 / span 2',
                gridColumn: '2',
              },
            }}
          />
        </BlogHighlightsCard>
      )}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          margin: theme.spacing(4, 2.5),
          padding: theme.spacing(4),
          zIndex: 100,
          [theme.breakpoints.up('md' as Breakpoint)]: {
            margin: theme.spacing(4, 6),
            padding: theme.spacing(4),
          },
        }}
      >
        <Button
          variant="primary"
          styles={{ marginBottom: theme.spacing(3), width: 144 }}
          onClick={() => handleButtonClick(activePost)}
        >
          {t('blog.goToArticle')}
        </Button>
        <Box sx={{ display: 'flex' }}>
          {blogArticles?.length ? (
            blogArticles.map(
              (_, paginationIndex) =>
                paginationIndex < maxItems && (
                  <Circle
                    key={`pagination-${paginationIndex}`}
                    data-index={paginationIndex}
                    paginationIndex={paginationIndex}
                    active={paginationIndex === activePost}
                    maxHighlights={maxItems}
                    onClick={handleChange}
                    swipeDeltaX={swipeDeltaX}
                    activePost={activePost}
                  />
                ),
            )
          ) : (
            <>
              <SkeletonCircle
                variant="rounded"
                sx={{ backgroundColor: theme.palette.grey[800] }}
              />
              <SkeletonCircle variant="rounded" />
              <SkeletonCircle variant="rounded" />
              <SkeletonCircle variant="rounded" />
              <SkeletonCircle variant="rounded" />
            </>
          )}
        </Box>
      </Box>
    </BlogHightsContainer>
  );
};
