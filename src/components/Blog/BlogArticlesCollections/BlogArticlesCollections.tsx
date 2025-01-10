'use client';

import type { BlogArticleData } from '@/types/strapi';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticlesTabs } from './BlogArticlesTabs';

interface BlogArticlesCollectionsProps {
  data: BlogArticleData[];
  tags: GetTagsResponse;
}

const pageSize = 6;
// Predefined order array

export const BlogArticlesCollections = ({
  data,
  tags,
}: BlogArticlesCollectionsProps) => {
  // Apply sorting function
  return (
    data &&
    tags.data?.length > 0 &&
    tags.data?.map((tag, tagIndex: number) => {
      const pagination = {
        page: 0,
        pageSize: pageSize,
        pageCount: Math.ceil(
          tag.attributes?.blog_articles?.data.length / pageSize,
        ),
        total: tag.attributes?.blog_articles?.data.length,
      };
      return (
        <BlogArticlesTabs
          index={tagIndex}
          key={`blog-article-collection-${tagIndex}`}
          tag={tag}
          tags={tags}
          pagination={pagination}
          data={tag.attributes?.blog_articles.data}
        />
      );
    })
  );
};
