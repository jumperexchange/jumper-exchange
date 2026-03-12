'use client';

import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';

import {
  Pagination,
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type {
  BlogArticleData,
  StrapiMetaPagination,
  TagAttributes,
} from '@/types/strapi';
import { chunkArray } from '@/utils/chunkArray';

import { BlogArticleCard } from '../BlogArticleCard/BlogArticleCard';
import {
  BlogArticlesCollectionsContainer,
  BlogArticlesCollectionsTitle,
} from './BlogArticlesCollections.style';
import { ArticlesGrid } from './BlogArticlesTabs.style';

interface BlogArticlesTabsProps {
  index: number;
  tag: TagAttributes;
  pagination: StrapiMetaPagination;
  data: BlogArticleData[];
}

export function BlogArticlesTabs({
  index,
  tag,
  data,
  pagination,
}: BlogArticlesTabsProps) {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const [pageTab, setPageTab] = useState(pagination.page);
  const chunkedPages = chunkArray(data, pagination.pageSize);

  const trackPagination = useCallback(
    (label: string, page: number) => {
      trackEvent({
        category: TrackingCategory.BlogArticlesBoard,
        label,
        action: TrackingAction.ClickPagination,
        data: {
          [TrackingEventParameter.Pagination]: page,
          [TrackingEventParameter.PaginationCat]: index ?? '',
        },
      });
    },
    [trackEvent, index],
  );

  const setPage = useCallback((page: number) => {
    setPageTab(page);
  }, []);

  const handleSetPage = useCallback(
    (page: number) => {
      trackPagination('click-pagination', page);
    },
    [trackPagination],
  );

  const handlePrev = useCallback(() => {
    trackPagination('click-pagination-prev', pageTab - 1);
  }, [trackPagination, pageTab]);

  const handleNext = useCallback(() => {
    trackPagination('click-pagination-next', pageTab + 1);
  }, [trackPagination, pageTab]);

  if (!chunkedPages) {
    return null;
  }

  return (
    <BlogArticlesCollectionsContainer id={tag?.Title}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <BlogArticlesCollectionsTitle variant="headerMedium">
          {tag?.Title}
        </BlogArticlesCollectionsTitle>
        {chunkedPages.map(
          (page, pageIndex) =>
            pageTab === pageIndex && (
              <ArticlesGrid key={`blog-article-tab-${pageIndex}-`}>
                {page.map((article, articleIndex: number) => (
                  <BlogArticleCard
                    sx={{
                      display: 'inline-block',
                      [theme.breakpoints.up('sm' as Breakpoint)]: {
                        width: '100%',
                      },
                    }}
                    article={article}
                    key={`blog-articles-collection-${index}-${articleIndex}`}
                    trackingCategory={TrackingCategory.BlogArticlesCollection}
                  />
                ))}
              </ArticlesGrid>
            ),
        )}
      </Box>
      {pagination.pageCount > 1 && (
        <Pagination
          variant={PaginationVariant.AllPages}
          id={tag?.Title}
          page={pageTab}
          setPage={setPage}
          pagination={pagination}
          onPrev={handlePrev}
          onNext={handleNext}
          onSetPage={handleSetPage}
        />
      )}
    </BlogArticlesCollectionsContainer>
  );
}
