'use client';

import { a11yProps, type TabProps } from '@/components/Tabs';
import type { BlogArticleData, StrapiMetaPagination } from '@/types/strapi';
import type { Breakpoint, Theme } from '@mui/material';
import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { TrackingCategory } from 'src/const/trackingKeys';
import { chunkArray } from 'src/utils/chunkArray';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import { BlogArticlesTab } from '../BlogArticlesCollections/BlogArticlesTab';
import { Pagination } from '../Pagination/Pagination';
import {
  BlogArticlesBoardContainer,
  BlogArticlesBoardTitle,
} from './BlogArticlesBoard.style';
import { BlogArticlesBoardTabs } from './BlogArticlesBoardTabs';

interface BlogArticlesBoardProps {
  data: BlogArticleData[];
  tags: GetTagsResponse;
  url: string;
}

const ariaLabel = 'blog-articles-board-tab-handler';
const pageSize = 6;
export const BlogArticlesBoard = ({
  data,
  url,
  tags,
}: BlogArticlesBoardProps) => {
  const { t } = useTranslation();
  const [tabId, setTabId] = useState<number | undefined>(0);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [catLabel, setCatLabel] = useState<string | undefined>(
    t('blog.allCategories'),
  );

  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const handleTagsClick = useCallback(
    (id: number, label?: string) => () => {
      if (!isDesktop && !openDropdown) {
        setOpenDropdown(true);
      } else {
        setOpenDropdown(false);
      }
      setTabId(id);
      setCatLabel(label);
    },
    [isDesktop, openDropdown],
  );

  const filteredTags = useMemo<TabProps[]>(() => {
    // default "All" Category
    // const defaultFilter = {
    //   id: 0,
    //   label:
    //     !isDesktop && tabId !== 0 ? catLabel || '' : t('blog.allCategories'),
    //   icon: !isDesktop && (
    //     <ArrowDropDownIcon
    //       sx={{
    //         position: 'absolute',
    //         right: theme.spacing(1),
    //         marginBottom: 0,
    //       }}
    //     />
    //   ),
    //   attributes: [],
    //   value: 0,
    //   onClick: handleTagsClick(0, t('blog.allCategories')),
    //   disabled: false,
    // };
    // tags
    const output = tags?.data.map((el, index: number) => {
      return {
        label: el.attributes.Title || '',
        value: el.id,
        onClick: handleTagsClick(index, el.attributes.Title),
        // disabled: false,
      };
    });
    // merge default + tags
    // output?.unshift(defaultFilter);
    return output;
  }, [handleTagsClick, tags?.data]);

  const handleClick = (event: { target: HTMLElement }) => {
    const classList = event.target.classList;

    if (openDropdown) {
      !classList?.contains(ariaLabel) && setOpenDropdown(false);
    }
  };

  return (
    <BlogArticlesBoardContainer
      id="see-all"
      onClick={(event: React.MouseEvent<HTMLDivElement>) =>
        handleClick({ target: event.target as HTMLElement })
      }
    >
      <BlogArticlesBoardTitle variant="headerMedium">
        {t('blog.categories')}
      </BlogArticlesBoardTitle>
      {filteredTags ? (
        <BlogArticlesBoardTabs
          ariaLabel={ariaLabel}
          openDropdown={openDropdown}
          filteredTags={filteredTags}
          tabId={tabId}
        />
      ) : (
        <Skeleton sx={{ width: '100%', height: 68 }} />
      )}
      {/* <Fade in={!!data} timeout={600}> */}
      {!data ? (
        Array.from({ length: tags.meta.pagination.pageSize }).map(
          (_, index) => (
            <BlogArticleCardSkeleton
              key={`blog-article-card-skeleton-${tabId}-${index}`}
            />
          ),
        )
      ) : tags.data?.length > 0 ? (
        tags.data?.map((tag, tagIndex: number) => {
          const pagination = {
            page: 0,
            pageSize: pageSize,
            pageCount: Math.ceil(
              tag.attributes.blog_articles.data.length / pageSize,
            ),
            total: tag.attributes.blog_articles.data.length,
          };
          return (
            <CategoryTabPanel
              value={tabId || 0}
              index={tagIndex}
              tags={tags}
              pagination={pagination}
              ariaLabel={ariaLabel}
              data={tag.attributes.blog_articles.data}
            />
          );
        })
      ) : (
        <p>No Content</p> //todo: find better option
      )}
      {/* </Fade> */}
    </BlogArticlesBoardContainer>
  );
};

interface CategoryTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  tags: GetTagsResponse;
  pagination: StrapiMetaPagination;
  ariaLabel: string;
  data: BlogArticleData[];
}

function CategoryTabPanel({
  children,
  value,
  index,
  tags,
  data,
  pagination,
}: CategoryTabPanelProps) {
  const theme = useTheme();
  const [pageTab, setPageTab] = useState(pagination.page);
  const chunkedPages = chunkArray(data, pagination.pageSize);
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      {...a11yProps(ariaLabel, value)}
    >
      {/* <BlogCarouselContainer
        sx={{
          minWidth: '100%',
          marginLeft: { sx: 0, md: 0, lg: 0, xl: 0 },
          [theme.breakpoints.up('md' as Breakpoint)]: {
            marginTop: theme.spacing(6),
          },
          [theme.breakpoints.up('xl' as Breakpoint)]: {
            marginTop: `${theme.spacing(6)}`,
          },
        }}
      > */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {chunkedPages.map((page, pageIndex) => (
          <BlogArticlesTab pageTab={pageTab} index={pageIndex}>
            {page.map((article, articleIndex: number) => (
              <BlogArticleCard
                styles={{
                  display: 'inline-block',
                  [theme.breakpoints.up('lg' as Breakpoint)]: {
                    width: 384,
                  },
                }}
                baseUrl={tags.url}
                id={article.id}
                key={`blog-articles-board}-${index}-${articleIndex}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
                trackingCategory={TrackingCategory.BlogArticlesBoard}
                content={article.attributes.Content}
                publishedAt={article.attributes.publishedAt}
                createdAt={article.attributes.createdAt}
                tags={article.attributes.tags}
              />
            ))}
          </BlogArticlesTab>
        ))}
      </Box>
      {
        /* todo: enable pagination*/
        pagination.pageCount > 0 && (
          <Pagination
            isEmpty={pagination.pageCount <= 1}
            page={pageTab}
            setPage={setPageTab}
            pagination={pagination}
            categoryId={value}
          />
        )
      }
      {/* </BlogCarouselContainer> */}
    </Box>
  );
}
