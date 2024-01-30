import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { BlogArticleData } from 'src/types';
import type { HandleNavigationIndexProps } from 'src/utils';
import { Circle } from '.';
import { Button } from '../Button';
import { PaginationSkeleton } from './PaginationSkeleton';

interface BlogHighlightsProps {
  styles?: CSSObject;
  articles: BlogArticleData[];
  activePost: number;
  handlePagination: ({
    direction,
    active,
    max,
  }: HandleNavigationIndexProps) => void;
  setActivePost: Dispatch<SetStateAction<number>>;
  maxItems: number;
  swipeDeltaX: number | null;
}

export const Pagination = ({
  styles,
  activePost,
  handlePagination,
  setActivePost,
  articles,
  maxItems,
  swipeDeltaX,
}: BlogHighlightsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { trackEvent } = useUserTracking();

  const handleChange = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const index = event.currentTarget.getAttribute('data-index');

    !!index && setActivePost(parseInt(index));
  };

  const handleButtonClick = (index: number) => {
    navigate(`/blog/${articles[index].attributes.Slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!!articles.length) {
        switch (event.keyCode) {
          case 13: // Enter key
            activePost &&
              navigate(`/blog/${articles[activePost].attributes.Slug}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 39: // Right arrow key
            handlePagination({
              direction: 'next',
              active: activePost,
              max: maxItems,
            });
            break;
          case 37: // Left arrow key
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
  }, [activePost, articles, handlePagination, maxItems, navigate]);

  return (
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
      {articles?.length ? (
        <Box sx={{ display: 'flex' }}>
          {articles.map(
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
          )}
        </Box>
      ) : (
        <PaginationSkeleton />
      )}
    </Box>
  );
};
