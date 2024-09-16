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
import { chunkArray } from 'src/utils/chunkArray';
import { BlogArticleCard } from '../BlogArticleCard';
import {
  BlogArticlesBoardHeader,
  BlogArticlesBoardTitle,
} from '../BlogArticlesBoard/BlogArticlesBoard.style';
import { Pagination } from '../Pagination/Pagination';
import { BlogArticlesCollectionsContainer } from './BlogArticlesCollections.style';
import { BlogArticlesTab } from './BlogArticlesTab';

interface BlogArticlesTabsProps {
  index: number;
  tag: TagAttributes;
  tags: GetTagsResponse;
  pagination: StrapiMetaPagination;
  data: BlogArticleData[];
}

export function BlogArticlesTabs({
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
    <BlogArticlesCollectionsContainer id={tag.attributes.Title}>
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
          <BlogArticlesTab
            pageTab={pageTab}
            index={pageIndex}
            key={`blog-article-tab-${pageIndex}`}
          >
            {page.map((article, articleIndex: number) => (
              <BlogArticleCard
                styles={{
                  display: 'inline-block',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    width: '100%',
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
        pagination.pageCount > 1 && (
          <Pagination
            id={tag.attributes.Title}
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
