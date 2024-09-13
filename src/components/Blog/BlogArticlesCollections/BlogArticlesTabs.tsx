'use client';

import type {
  BlogArticleData,
  StrapiMetaPagination,
  TagAttributes,
} from '@/types/strapi';
import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { TrackingCategory } from 'src/const/trackingKeys';
import { BlogArticleCard } from '../BlogArticleCard';
import {
  BlogArticlesBoardHeader,
  BlogArticlesBoardTitle,
} from '../BlogArticlesBoard/BlogArticlesBoard.style';
import { BlogArticlesCollectionsContainer } from './BlogArticlesCollections.style';
import { BlogArticlesTab } from './BlogArticlesTab';
import { BlogArticlesCollectionsPagination as Pagination } from './Pagination';

interface BlogArticlesTabsProps {
  children?: React.ReactNode;
  index: number;
  tag: TagAttributes;
  tags: GetTagsResponse;
  pagination: StrapiMetaPagination;
  ariaLabel: string;
  data: BlogArticleData[];
}

export function BlogArticlesTabs({
  children,
  index,
  tag,
  tags,
  data,
  pagination,
}: BlogArticlesTabsProps) {
  const theme = useTheme();
  const [pageTab, setPageTab] = useState(pagination.page);
  const chunkedPages = chunkArray(data, pagination.pageSize);

  return (
    <BlogArticlesCollectionsContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <BlogArticlesBoardHeader>
          <BlogArticlesBoardTitle variant="headerMedium">
            {tag.attributes.Title}
          </BlogArticlesBoardTitle>
        </BlogArticlesBoardHeader>
        {chunkedPages.map((page, pageIndex) => (
          <BlogArticlesTab pageTab={pageTab} index={pageIndex}>
            {page.map((article, articleIndex: number) => (
              <BlogArticleCard
                styles={{
                  display: 'inline-block',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    width: 'unset',
                  },
                }}
                baseUrl={tags.url}
                id={article.id}
                key={`blog-articles-collection}-${index}-${articleIndex}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
                trackingCategory={TrackingCategory.BlogArticlesCollection}
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
        pagination.pageCount > 0 ? (
          <Pagination
            isEmpty={pagination.pageCount <= 1}
            page={pageTab}
            setPage={setPageTab}
            pagination={pagination}
            categoryId={index}
          />
        ) : null
      }
    </BlogArticlesCollectionsContainer>
  );
}

function chunkArray(array: any[], chunkSize: number): any[][] {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}
