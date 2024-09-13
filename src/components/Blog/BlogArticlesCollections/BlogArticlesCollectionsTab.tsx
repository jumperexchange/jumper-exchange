import type { PropsWithChildren } from 'react';
import React from 'react';
import { ArticlesGrid } from './BlogArticlesCollections.style';

interface BlogArticlesCollectionsTabProps {
  pageTab: number;
  index: number;
}

export const BlogArticlesCollectionsTab: React.FC<
  PropsWithChildren<BlogArticlesCollectionsTabProps>
> = ({ children, pageTab, index }) => {
  return (
    <ArticlesGrid hidden={pageTab !== index} active={pageTab === index}>
      {children}
    </ArticlesGrid>
  );
};
