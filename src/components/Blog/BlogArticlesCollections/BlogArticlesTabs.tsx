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
import { CarouselHeader } from '../BlogCarousel';
import { Pagination } from '../Pagination/Pagination';
import {
  BlogArticlesCollectionsContainer,
  BlogArticlesCollectionsTitle,
} from './BlogArticlesCollections.style';
import { ArticlesGrid } from './BlogArticlesTabs.style';

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
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CarouselHeader>
          <BlogArticlesCollectionsTitle variant="headerMedium">
            {tag.attributes.Title}
          </BlogArticlesCollectionsTitle>
        </CarouselHeader>
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
                    baseUrl={tags.url}
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
