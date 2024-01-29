import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { Breakpoint } from '@mui/material';
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  STRAPI_BLOG_ARTICLES,
  STRAPI_TAGS,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useStrapi, useUserTracking } from 'src/hooks';
import {
  EventTrackingTool,
  type BlogArticleData,
  type TagAttributes,
} from 'src/types';
import { getContrastAlphaColor } from 'src/utils';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import type { TabProps } from '../Tabs';
import { Tabs } from '../Tabs';

const pageSize = 6;
export const BlogArticlesBoard = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [catId, setCatId] = useState<number | undefined>(undefined);
  const [catLabel, setCatLabel] = useState<string | undefined>(
    t('blog.allCategories'),
  );
  const { trackEvent } = useUserTracking();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg' as Breakpoint));
  const [page, setPage] = useState<number>(1);
  const {
    data: blogArticles,
    url,
    meta,
  } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    filterTag: catId === 0 ? undefined : catId,
    pagination: { page: page, pageSize: pageSize },
    sort: 'desc',
    queryKey:
      catId === 0
        ? `blog-articles-board-${page}`
        : `blog-articles-board-${catId}-${page}`,
  });

  const {
    data: tags,
    isSuccess,
    isLoading,
  } = useStrapi<TagAttributes>({
    contentType: STRAPI_TAGS,
    queryKey: 'tags',
  });

  const handleTagsClick = useCallback(
    (id: number, label?: string) => () => {
      if (!isDesktop && !openDropdown) {
        setOpenDropdown(true);
      } else {
        setOpenDropdown(false);
      }
      setCatId(id);
      setCatLabel(label);
    },
    [isDesktop, openDropdown],
  );

  const filteredTags = useMemo<TabProps[]>(() => {
    const defaultFilter = {
      id: 0,
      label: !isDesktop && catId !== 0 ? catLabel : t('blog.allCategories'),
      icon: !isDesktop && (
        <ArrowDropDownIcon
          sx={{
            position: 'absolute',
            right: theme.spacing(1),
            marginBottom: 0,
          }}
        />
      ),
      attributes: [],
      value: 0,
      onClick: handleTagsClick(0, t('blog.allCategories')),
      disabled: false,
    };
    const output = tags?.map((el, index) => {
      return {
        label: el.attributes.Title || undefined, //el.attributes.Title,
        value: el.id,
        onClick: handleTagsClick(el.id, el.attributes.Title),
        // disabled: false,
      };
    });

    output?.unshift(defaultFilter);
    return output;
  }, [catId, catLabel, handleTagsClick, isDesktop, t, tags, theme]);

  const containerStyles = {
    marginTop: theme.spacing(4),
    backgroundColor:
      !isDesktop && openDropdown
        ? theme.palette.surface1.main
        : theme.palette.mode === 'dark'
          ? getContrastAlphaColor(theme, '12%')
          : getContrastAlphaColor(theme, '4%'),
    display: 'flex',
    // height: openDropdown ? '68px' : 'auto',
    maxHeight: openDropdown ? 1000 : 0,
    // height: openDropdown ? 'auto' : 68,
    borderRadius: '12px',
    transitionProperty: 'max-height, background-color',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    padding: theme.spacing(0.5, 1),
    overflow: 'hidden',
    minHeight: 68,
    width: '100%',
    maxWidth: '320px',

    [theme.breakpoints.up('lg')]: {
      maxWidth: 'unset',
      borderRadius: '28px',
      minWidth: 392,
      width: 'auto',
      display: 'flex',
    },

    div: {
      [theme.breakpoints.up('lg')]: {
        height: 56,
      },
    },

    '.MuiTabs-indicator': {
      minWidth: '80%',
      width: 300,
      maxWidth: 320,
      left: '50%',

      // maxWidth: '80%',

      top: `${theme.spacing(0.75)} !important`,
      borderRadius: '12px',
      transform: 'translateX(-50%)',
      zIndex: '-1',
      [theme.breakpoints.up('lg')]: {
        width: 'auto',
        minWidth: 'unset',
        position: 'absolute',
        top: '50% !important',
        left: 'unset',
        transform: 'translateY(-50%) scaleY(0.98)',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.alphaLight300.main
            : theme.palette.white.main,
        height: 48,
        zIndex: -1,
        borderRadius: 24,
      },
    },
  };

  const tabStyles = {
    height: 48,
    borderRadius: '12px',
    width: '100%',
    maxWidth: '320px',
    [theme.breakpoints.up('lg')]: {
      width: 142,
      borderRadius: '24px',
    },
  };

  const handlePage = (page: number) => {
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: catId,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    setPage(page);
  };

  const handleNext = () => {
    if (page < meta.pagination.pageCount) {
      setPage((state) => state + 1);
    } else {
      setPage(1);
    }
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination-next',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: catId,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((state) => state - 1);
    } else {
      setPage(meta.pagination.pageCount);
    }
    trackEvent({
      category: TrackingCategory.BlogArticlesBoard,
      label: 'click-pagination-prev',
      action: TrackingAction.ClickPagination,
      data: {
        [TrackingEventParameter.Pagination]: page,
        [TrackingEventParameter.PaginationCat]: catId,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  return (
    <Box sx={{ marginBottom: theme.spacing(10) }}>
      <Grid>
        <Typography
          variant="lifiHeaderMedium"
          sx={{
            textAlign: 'center',
            margin: theme.spacing(10, 'auto', 0),
          }}
        >
          {t('blog.categories')}
        </Typography>
        <Tabs
          data={filteredTags}
          value={catId ?? 0}
          orientation={isDesktop ? 'horizontal' : 'vertical'}
          ariaLabel="categories-switch-tabs"
          containerStyles={containerStyles}
          tabStyles={tabStyles}
        />

        <Grid
          container
          sx={{
            margin: theme.spacing(2, 'auto'),
            display: 'grid',
            marginTop: `calc(${theme.spacing(4)} + 56px + ${theme.spacing(
              4,
            )} )`,
            gridTemplateColumns: '1fr',
            gap: theme.spacing(4),
            maxWidth: theme.breakpoints.values.md,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              gridTemplateColumns: '1fr 1fr',
            },
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              gridTemplateColumns: '1fr 1fr 1fr',
            },
          }}
        >
          {isSuccess && !isLoading ? (
            blogArticles?.length > 0 ? (
              blogArticles?.map((article, index) => (
                <BlogArticleCard
                  baseUrl={url}
                  id={article.id}
                  key={`blog-articles-board-${index}`}
                  image={article.attributes.Image}
                  title={article.attributes.Title}
                  slug={article.attributes.Slug}
                  trackingCategory={TrackingCategory.BlogArticlesBoard}
                  styles={{
                    width: '100%',
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      width: '100% !important',
                    },
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? getContrastAlphaColor(theme, '12%')
                          : getContrastAlphaColor(theme, '4%'),
                    },
                  }}
                />
              ))
            ) : (
              <p>No Content</p>
            )
          ) : (
            Array.from({ length: pageSize }).map((_, index) => (
              <BlogArticleCardSkeleton
                key={`blog-article-card-skeleton-${index}`}
                containerStyles={{
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    width: '100%',
                    maxWidth: 420,
                  },
                }}
                imageStyles={{
                  width: 'auto',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    width: 262,
                    height: 148,
                  },
                }}
                contentStyles={{
                  padding: 0,
                  width: '100%',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    // width: 230,
                    height: 48,
                  },
                }}
              />
            ))
          )}
        </Grid>
        {meta?.pagination.pageCount > 1 && (
          <Box
            sx={{
              marginTop: theme.spacing(3),
              display: 'flex',
              justifyContent: 'center',
              gap: theme.spacing(2),
            }}
          >
            <IconButton
              onClick={() => handlePrev()}
              disableRipple={false}
              sx={{
                color: theme.palette.grey[500],
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? getContrastAlphaColor(theme, '12%')
                      : getContrastAlphaColor(theme, '4%'),
                },
              }}
            >
              <ArrowBackIosIcon
                sx={{
                  marginLeft: theme.spacing(0.75),
                }}
              />
            </IconButton>

            {Array.from({ length: meta?.pagination.pageCount }).map(
              (_, index) => {
                const actualPage = index + 1;
                return (
                  <IconButton
                    onClick={() => handlePage(actualPage)}
                    sx={{
                      ...(actualPage === page
                        ? {
                            color:
                              theme.palette.mode === 'light'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[300],
                          }
                        : {
                            color:
                              theme.palette.mode === 'light'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[400],
                          }),
                      width: '40px',
                      height: '40px',
                      ...(actualPage === page && {
                        '& .MuiTouchRipple-root': {
                          backgroundColor:
                            theme.palette.mode === 'light'
                              ? theme.palette.alphaDark100.main
                              : theme.palette.alphaLight300.main,
                          zIndex: -1,
                        },
                      }),
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? getContrastAlphaColor(theme, '12%')
                            : getContrastAlphaColor(theme, '4%'),
                      },
                    }}
                  >
                    <Typography variant="lifiBodyMedium">
                      {actualPage}
                    </Typography>
                  </IconButton>
                );
              },
            )}
            <IconButton
              onClick={() => handleNext()}
              sx={{
                color: theme.palette.grey[500],
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? getContrastAlphaColor(theme, '12%')
                      : getContrastAlphaColor(theme, '4%'),
                },
              }}
            >
              <ArrowForwardIosIcon
                sx={{
                  marginLeft: theme.spacing(0.25),
                }}
              />
            </IconButton>
          </Box>
        )}
      </Grid>
    </Box>
  );
};
