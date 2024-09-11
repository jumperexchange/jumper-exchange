'use client';

import type {
  BlogArticleData,
  StrapiMetaPagination,
  TagAttributes,
} from '@/types/strapi';
import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { TrackingCategory } from 'src/const/trackingKeys';
import { BlogArticleCard } from '../BlogArticleCard';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import {
  BlogArticlesBoardHeader,
  BlogArticlesBoardTitle,
} from '../BlogArticlesBoard/BlogArticlesBoard.style';
import {
  ArticlesGrid,
  BlogArticlesCollectionsContainer,
} from './BlogArticlesCollections.style';
import { BlogArticlesCollectionsPagination as Pagination } from './Pagination';

interface BlogArticlesCollectionsProps {
  data: BlogArticleData[];
  tags: GetTagsResponse;
  url: string;
}

const ariaLabel = 'blog-articles-board-tabs';
const pageSize = 6;
export const BlogArticlesCollections = ({
  data,
  url,
  tags,
}: BlogArticlesCollectionsProps) => {
  return !data ? (
    Array.from({ length: tags.meta.pagination.pageSize }).map((_, index) => (
      <BlogArticleCardSkeleton key={`blog-article-card-skeleton-${index}`} />
    ))
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
          index={tagIndex}
          tag={tag}
          tags={tags}
          pagination={pagination}
          ariaLabel={ariaLabel}
          data={tag.attributes.blog_articles.data}
        />
      );
    })
  ) : (
    <p>No Content</p> //todo: find better option
  );
};

interface CategoryTabPanelProps {
  children?: React.ReactNode;
  index: number;
  tag: TagAttributes;
  tags: GetTagsResponse;
  pagination: StrapiMetaPagination;
  ariaLabel: string;
  data: BlogArticleData[];
}

function CategoryTabPanel({
  children,
  index,
  tag,
  tags,
  data,
  pagination,
}: CategoryTabPanelProps) {
  const theme = useTheme();
  const [pageTab, setPageTab] = useState(pagination.page);
  const chunkedPages = chunkArray(data, pagination.pageSize);
  console.log('chunkedPages', chunkedPages);
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
          <CategoryPaginationPage pageTab={pageTab} index={pageIndex}>
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
          </CategoryPaginationPage>
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

interface CategoryPaginationPageProps {
  pageTab: number;
  index: number;
}

const CategoryPaginationPage: React.FC<
  PropsWithChildren<CategoryPaginationPageProps>
> = ({ children, pageTab, index }) => {
  return (
    <ArticlesGrid hidden={pageTab !== index} active={pageTab === index}>
      {children}
    </ArticlesGrid>
  );
};
