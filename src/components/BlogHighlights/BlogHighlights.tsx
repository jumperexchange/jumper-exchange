import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, Grid, Typography, alpha, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStrapi, useSwipe } from 'src/hooks';
import type { BlogArticleData } from 'src/types';
import type { HandleNavigationIndexProps } from 'src/utils';
import { handleNavigationIndex } from 'src/utils';
import { BlogHighlightsImage, Circle } from '.';
import { Button } from '../Button';

interface BlogHighlightsProps {
  styles?: CSSObject;
}

const maxHighlights = 5;

export const BlogHighlights = ({ styles }: BlogHighlightsProps) => {
  const [activePost, setActivePost] = useState<number>(0);
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleChange = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    // Access data attributes from the clicked element
    const index = event.currentTarget.getAttribute('data-index');

    // Log the data attributes
    index && setActivePost(parseInt(index));
  };
  const { data: blogArticles, url } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    queryKey: 'blog-articles',
  });

  const handleButtonClick = (index: number) => {
    console.log('index', index);
    // if (!!index) {
    console.log(
      'HANDLE BUTTON CLICK',
      swipe.swipeListener.activeTouch,
      blogArticles[index],
      index,
    );
    navigate(`/blog/${blogArticles[index].attributes.Slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  };

  const handlePagination = useCallback(
    ({ direction, active, max }: HandleNavigationIndexProps) => {
      const newItem = handleNavigationIndex({
        direction,
        active,
        max,
      });
      console.log({ direction, active, max, newItem });
      newItem !== undefined && setActivePost(newItem);
    },
    [],
  );

  const swipe = useSwipe({
    onSwipedLeft: () =>
      handlePagination({
        direction: 'next',
        active: activePost,
        max:
          blogArticles.length > maxHighlights
            ? maxHighlights
            : blogArticles.length,
      }),
    onSwipedRight: () =>
      handlePagination({
        direction: 'prev',
        active: activePost,
        max:
          blogArticles.length > maxHighlights
            ? maxHighlights
            : blogArticles.length,
      }),
    onSwipe: () => {
      console.log('swiping');
    },
    onClick: () => {
      console.log('CLICK');
    },
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!!blogArticles.length) {
        switch (event.keyCode) {
          case 13: // Enter key
            console.log('Enter key pressed!', activePost && true);
            activePost &&
              navigate(`/blog/${blogArticles[activePost].attributes.Slug}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            break;
          case 39: // Right arrow key
            console.log('Right arrow key pressed!', activePost && true);
            handlePagination({
              direction: 'next',
              active: activePost,
              max:
                blogArticles.length > maxHighlights
                  ? maxHighlights
                  : blogArticles.length,
            });
            break;
          case 37: // Left arrow key
            console.log('Left arrow key pressed!', activePost && true);
            handlePagination({
              direction: 'prev',
              active: activePost,
              max:
                blogArticles.length > maxHighlights
                  ? maxHighlights
                  : blogArticles.length,
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
  }, [activePost, blogArticles, handlePagination, navigate]);

  return blogArticles ? (
    <Box
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr',
        [theme.breakpoints.up('md' as Breakpoint)]: {
          // height: 600,
        },
      }}
    >
      {blogArticles.map(
        (el, index, source) =>
          index < maxHighlights && (
            <Grid
              key={`blog-highlights-${index}`}
              container
              sx={{
                display: 'grid',
                gridColumn: 1,
                gridRow: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.25),
                // position: 'absolute',
                top: theme.spacing(-4),
                ...(activePost === index && {
                  opacity: 1,
                }),
                ...(activePost !== index && {
                  opacity: 0,
                  zIndex: 100,
                  pointerEvents: 'none',
                }),
                // ...(swipe.swipeListener.activeTouch &&
                //   swipe.swipeListener.distance === 0 && {
                //     opacity: 0,
                //   }),
                ...(swipe.swipeListener.activeTouch &&
                  swipe.swipeListener.distance > 0 &&
                  index ===
                    handleNavigationIndex({
                      direction: 'next',
                      active: activePost,
                      max: maxHighlights,
                    }) && {
                    opacity: Math.abs(swipe.swipeListener.distance) / 250,
                  }),
                ...(swipe.swipeListener.activeTouch &&
                  swipe.swipeListener.distance < 0 &&
                  index ===
                    handleNavigationIndex({
                      direction: 'prev',
                      active: activePost,
                      max: maxHighlights,
                    }) && {
                    opacity: Math.abs(swipe.swipeListener.distance) / 250,
                  }),
                ...(swipe.swipeListener.activeTouch &&
                  swipe.swipeListener.distance < 0 &&
                  index === activePost && {
                    opacity: 1 - Math.abs(swipe.swipeListener.distance) / 250,
                  }),
                ...(swipe.swipeListener.activeTouch &&
                  swipe.swipeListener.distance > 0 &&
                  index === activePost && {
                    opacity: 1 - Math.abs(swipe.swipeListener.distance) / 250,
                  }),
                margin: theme.spacing(4, 6),
                gridColumnGap: '2rem',
                borderRadius: '36px',
                width: 'auto',
                padding: theme.spacing(4),
                gridRowGap: 4,
                gridTemplateRows: 'auto',
                gridTemplateColumns: '1fr',
                alignItems: 'center',
                [theme.breakpoints.up('md' as Breakpoint)]: {
                  gridTemplateColumns: '.75fr 1fr',
                  gridTemplateRows: '1fr 80px',
                  height: 600,
                },
              }}
              {...swipe.swipeHandlers}
            >
              <Box
                sx={{
                  gridRow: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  // alignItems: 'center',
                  padding: theme.spacing(0, 6, 2, 2),
                  [theme.breakpoints.up('md' as Breakpoint)]: {
                    paddingBottom: theme.spacing(10),
                    gridRow: 'auto',
                  },
                }}
              >
                <Typography
                  variant="lifiHeaderMedium"
                  sx={{
                    marginTop: theme.spacing(2),
                    marginBottom: theme.spacing(2),
                    maxHeight: 156,
                    overflow: 'hidden',
                    [theme.breakpoints.up('md' as Breakpoint)]: {
                      marginTop: theme.spacing(0),
                    },
                  }}
                >
                  {el.attributes.Title}
                </Typography>
                <Typography
                  sx={{
                    marginBottom: theme.spacing(3),
                    maxHeight: 172,
                    overflow: 'hidden',
                  }}
                >
                  {el.attributes.Subtitle}
                </Typography>
              </Box>
              <BlogHighlightsImage
                onClick={() => handleButtonClick(index)}
                draggable={false}
                src={`${url.origin}${blogArticles[index].attributes.Image.data.attributes.url}`}
                alt={
                  blogArticles[activePost].attributes.Image.data.attributes
                    .alternativeText
                }
              />
            </Grid>
          ),
      )}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          margin: theme.spacing(4, 6),
          padding: theme.spacing(4),
          zIndex: 100,
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
          {blogArticles.map(
            (_, paginationIndex) =>
              paginationIndex < maxHighlights && (
                <Circle
                  key={`pagination-${paginationIndex}`}
                  data-index={paginationIndex}
                  active={paginationIndex === activePost}
                  onClick={handleChange}
                  sx={{
                    ...(swipe.swipeListener.activeTouch &&
                      swipe.swipeListener.distance > 0 &&
                      paginationIndex ===
                        handleNavigationIndex({
                          direction: 'next',
                          active: activePost,
                          max: maxHighlights,
                        }) && {
                        opacity:
                          Math.abs(swipe.swipeListener.distance) / 250 + 0.16,
                      }),
                    ...(swipe.swipeListener.activeTouch &&
                      swipe.swipeListener.distance < 0 &&
                      paginationIndex ===
                        handleNavigationIndex({
                          direction: 'prev',
                          active: activePost,
                          max: maxHighlights,
                        }) && {
                        opacity:
                          Math.abs(swipe.swipeListener.distance) / 250 + 0.16,
                      }),
                    ...(swipe.swipeListener.activeTouch &&
                      swipe.swipeListener.distance < 0 &&
                      paginationIndex === activePost && {
                        opacity: Math.max(
                          0.16,
                          1 -
                            Math.abs(
                              swipe.swipeListener.distance < 250
                                ? swipe.swipeListener.distance / 250
                                : 0.84,
                            ),
                        ),
                      }),
                    ...(swipe.swipeListener.activeTouch &&
                      swipe.swipeListener.distance > 0 &&
                      paginationIndex === activePost && {
                        opacity: Math.max(
                          0.16,
                          1 -
                            Math.abs(
                              swipe.swipeListener.distance < 250
                                ? swipe.swipeListener.distance / 250
                                : 0.84,
                            ),
                        ),
                      }),
                  }}
                />
              ),
          )}
        </Box>
      </Box>
    </Box>
  ) : null;
};
