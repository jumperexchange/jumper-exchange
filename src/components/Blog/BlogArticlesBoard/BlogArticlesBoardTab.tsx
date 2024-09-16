'use client';

import { a11yProps } from '@/components/Tabs';
import type { BlogArticleData, StrapiMetaPagination } from '@/types/strapi';
import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { TrackingCategory } from 'src/const/trackingKeys';
import { chunkArray } from 'src/utils/chunkArray';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticlesTab } from '../BlogArticlesCollections/BlogArticlesTab';
import { Pagination } from '../Pagination/Pagination';

interface BlogArticlesBoardTabProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  tags: GetTagsResponse;
  pagination: StrapiMetaPagination;
  ariaLabel: string;
  data: BlogArticleData[];
}

export function BlogArticlesBoardTab({
  children,
  value,
  index,
  ariaLabel,
  tags,
  data,
  pagination,
}: BlogArticlesBoardTabProps) {
  const theme = useTheme();
  const [pageTab, setPageTab] = useState(pagination.page);
  const chunkedPages = chunkArray(data, pagination.pageSize);
  return (
    value === index && (
      <Box
        role="tabpanel"
        // hidden={value !== index}
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
              inactive={pagination.pageCount <= 1}
              page={pageTab}
              setPage={setPageTab}
              pagination={pagination}
              categoryId={value}
            />
          )
        }
        {/* </BlogCarouselContainer> */}
      </Box>
    )
  );
}
