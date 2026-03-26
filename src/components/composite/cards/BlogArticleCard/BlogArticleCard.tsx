import type { FC } from 'react';
import type { BlogArticleCardProps } from './types';
import { PreviewBlogArticleCard } from './variants/PreviewBlogArticleCard';

export const BlogArticleCard: FC<BlogArticleCardProps> = ({
  variant,
  ...rest
}) => {
  if (variant === 'preview') {
    return <PreviewBlogArticleCard {...rest} variant="preview" />;
  }
  return null;
};
