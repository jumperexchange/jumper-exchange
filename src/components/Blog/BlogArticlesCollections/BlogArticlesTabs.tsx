'use client';

import type {
  BlogArticleData,
  StrapiMetaPagination,
  TagAttributes,
} from '@/types/strapi';
import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import { TrackingCategory } from 'src/const/trackingKeys';
import { chunkArray } from 'src/utils/chunkArray';
import { BlogArticleCard } from '../BlogArticleCard';
import { Pagination } from '../Pagination/Pagination';
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
  const [pageTab, setPageTab] = useState(pagination.page);
  const chunkedPages = chunkArray(data, pagination.pageSize);

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
                    styles={{
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
      {
        /* todo: enable pagination*/
        pagination.pageCount > 1 && (
          <Pagination
            id={tag?.Title}
            page={pageTab}
            setPage={setPageTab}
            pagination={pagination}
            categoryId={index}
          />
        )
      }
    </BlogArticlesCollectionsContainer>
  );
}
