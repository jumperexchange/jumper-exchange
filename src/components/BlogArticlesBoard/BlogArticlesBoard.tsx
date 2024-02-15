import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { Breakpoint } from '@mui/material';
import {
  Fade,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STRAPI_BLOG_ARTICLES, STRAPI_TAGS, TrackingCategory } from 'src/const';
import { useStrapi } from 'src/hooks';
import { type BlogArticleData, type TagAttributes } from 'src/types';
import { getContrastAlphaColor } from 'src/utils';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import type { TabProps } from '../Tabs';
import { ArticlesGrid } from './BlogArticlesBoard.style';
import { BlogArticlesBoardTabs } from './BlogArticlesBoardTabs';
import { BlogArticlesBoardPagination as Pagination } from './Pagination';

const pageSize = 6;
export const BlogArticlesBoard = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [catId, setCatId] = useState<number | undefined>(undefined);
  const [catLabel, setCatLabel] = useState<string | undefined>(
    t('blog.allCategories'),
  );
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg' as Breakpoint));
  const [page, setPage] = useState<number>(1);
  const {
    data: blogArticles,
    url,
    meta,
    isFetching,
    isRefetching,
  } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    filterTag: catId ? [catId] : null,
    pagination: { page: page, pageSize: pageSize },
    sort: 'desc',
    queryKey:
      catId === 0
        ? ['blog-articles-board', page]
        : ['blog-articles-board', page, catId],
  });

  const { data: tags, isSuccess } = useStrapi<TagAttributes>({
    contentType: STRAPI_TAGS,
    queryKey: ['tags'],
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
    // default "All" Category
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
    // tags
    const output = tags?.map((el, index) => {
      return {
        label: el.attributes.Title || undefined, //el.attributes.Title,
        value: el.id,
        onClick: handleTagsClick(el.id, el.attributes.Title),
        // disabled: false,
      };
    });
    // merge default + tags
    output?.unshift(defaultFilter);
    return output;
  }, [catId, catLabel, handleTagsClick, isDesktop, t, tags, theme]);

  return (
    <Grid
      sx={{ marginBottom: theme.spacing(10), position: 'relative' }}
      id="see-all"
    >
      <Typography
        variant="lifiHeaderMedium"
        sx={{
          textAlign: 'center',
          margin: theme.spacing(10, 'auto', 0),
        }}
      >
        {t('blog.categories')}
      </Typography>
      {filteredTags ? (
        <BlogArticlesBoardTabs
          openDropdown={openDropdown}
          filteredTags={filteredTags}
          catId={catId}
        />
      ) : (
        <Skeleton sx={{ width: '100%', height: 68 }} />
      )}
      <Fade in={!isFetching || !isRefetching} timeout={600}>
        <ArticlesGrid container>
          {isFetching || isRefetching ? (
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
                  width: '100%',
                  height: 'auto',
                  aspectRatio: 1.77,
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
          ) : isSuccess && blogArticles?.length > 0 ? (
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
                    // width: '100% !important',
                  },
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? getContrastAlphaColor(theme, '12%')
                        : getContrastAlphaColor(theme, '4%'),
                  },
                }}
                content={article.attributes.Content}
                publishedAt={article.attributes.publishedAt}
                createdAt={article.attributes.createdAt}
                tags={article.attributes.tags}
              />
            ))
          ) : (
            <p>No Content</p>
          )}
        </ArticlesGrid>
      </Fade>
      {
        <Pagination
          isSuccess={(!isFetching || !isRefetching) && isSuccess}
          isEmpty={meta?.pagination.pageCount < 1}
          page={page}
          setPage={setPage}
          meta={meta}
          catId={catId}
        />
      }
    </Grid>
  );
};
