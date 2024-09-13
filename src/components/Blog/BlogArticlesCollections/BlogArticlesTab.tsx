'use client';

import type { PropsWithChildren } from 'react';
import { ArticlesGrid } from './BlogArticlesCollections.style';

interface BlogArticlesTabProps {
  pageTab: number;
  index: number;
}

export const BlogArticlesTab: React.FC<
  PropsWithChildren<BlogArticlesTabProps>
> = ({ children, pageTab, index }) => {
  return (
    pageTab === index && (
      <ArticlesGrid active={pageTab === index}>{children}</ArticlesGrid>
    )
  );
};
