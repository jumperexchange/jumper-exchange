'use client';

import type { BlogArticleData } from '@/types/strapi';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticlesTabs } from './BlogArticlesTabs';

interface BlogArticlesCollectionsProps {
  data: BlogArticleData[];
  tags: GetTagsResponse['data'];
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
    tags?.length > 0 &&
    tags?.map((tag, tagIndex: number) => {
      const pagination = {
        page: 0,
        pageSize: pageSize,
        pageCount: Math.ceil(tag?.blog_articles?.length / pageSize),
        total: tag?.blog_articles?.length,
      };

      if (!tag?.blog_articles || tag?.blog_articles.length === 0) {
        return null;
      }

      return (
        <BlogArticlesTabs
          index={tagIndex}
          key={`blog-article-collection-${tagIndex}`}
          tag={tag}
          pagination={pagination}
          data={tag?.blog_articles}
        />
      );
    })
  );
};
