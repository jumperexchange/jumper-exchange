'use client';

import type { BlogArticleData } from '@/types/strapi';
import type { GetTagsResponse } from 'src/app/lib/getTags';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import { BlogArticlesTabs } from './BlogArticlesTabs';

interface BlogArticlesCollectionsProps {
  data: BlogArticleData[];
  tags: GetTagsResponse;
  url: string;
}

const pageSize = 6;
// Predefined order array
const predefinedOrder = ['Announcement', 'Partner', 'Bridge'];

// Function to sort based on predefined order
const sortTags = (tags: GetTagsResponse) => {
  return tags.data.sort((a, b) => {
    const titleA = a.attributes.Title;
    const titleB = b.attributes.Title;

    const indexA = predefinedOrder.indexOf(titleA);
    const indexB = predefinedOrder.indexOf(titleB);

    // Categories in predefinedOrder come first, rest keep original order
    if (indexA === -1 && indexB === -1) {
      return 0;
    } // Both are irrelevant
    if (indexA === -1) {
      return 1;
    } // `a` is irrelevant
    if (indexB === -1) {
      return -1;
    } // `b` is irrelevant
    return indexA - indexB; // Sort by predefined order
  });
};

export const BlogArticlesCollections = ({
  data,
  url,
  tags,
}: BlogArticlesCollectionsProps) => {
  // Apply sorting function
  sortTags(tags);
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
        <BlogArticlesTabs
          index={tagIndex}
          tag={tag}
          tags={tags}
          pagination={pagination}
          data={tag.attributes.blog_articles.data}
        />
      );
    })
  ) : (
    <p>No Content</p> //todo: find better option
  );
};
