import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { Breakpoint } from '@mui/material';
import {
  Fade,
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
import type { TabProps } from '../../Tabs';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import {
  ArticlesGrid,
  BlogArticlesBoardContainer,
} from './BlogArticlesBoard.style';
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
    isSuccess: articlesIsSuccess,
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
    <BlogArticlesBoardContainer id="see-all">
      <Typography
        variant="lifiHeaderMedium"
        sx={{
          fontFamily: 'Urbanist, Inter',
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
          {!articlesIsSuccess ? (
            Array.from({ length: pageSize }).map((_, index) => (
              <BlogArticleCardSkeleton
                key={`blog-article-card-skeleton-${index}`}
                containerStyles={{
                  flexShrink: 0,
                  width: '100%',
                  border: 'unset',
                  boxShadow: 'unset',
                  paddingBottom: 0,
                  borderRadius: '32px',
                  transition: 'unset',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    minWidth: 250,
                    width: 416,
                  },
                }}
                imageStyles={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
                  aspectRatio: 550 / 309,
                }}
                contentStyles={{
                  padding: 0,
                  width: '100%',
                  '&:last-child': { paddingBottom: 0 },
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    // width: 230,
                    height: 176,
                  },
                  [theme.breakpoints.up('xl' as Breakpoint)]: {
                    // width: 230,
                    height: 176,
                  },
                }}
              />
            ))
          ) : articlesIsSuccess && blogArticles?.length > 0 ? (
            blogArticles?.map((article, index) => (
              <BlogArticleCard
                baseUrl={url}
                id={article.id}
                key={`blog-articles-board-${index}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
                trackingCategory={TrackingCategory.BlogArticlesBoard}
                content={article.attributes.Content}
                publishedAt={article.attributes.publishedAt}
                createdAt={article.attributes.createdAt}
                tags={article.attributes.tags}
              />
            ))
          ) : (
            <p>No Content</p> //todo: find
          )}
        </ArticlesGrid>
      </Fade>
      {meta?.pagination.pageCount > 1 ? (
        <Pagination
          isSuccess={(!isFetching || !isRefetching) && isSuccess}
          isEmpty={meta?.pagination.pageCount < 1}
          page={page}
          setPage={setPage}
          meta={meta}
          catId={catId}
        />
      ) : null}
    </BlogArticlesBoardContainer>
  );
};
