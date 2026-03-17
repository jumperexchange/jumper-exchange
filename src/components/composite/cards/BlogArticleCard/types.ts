import type { BlogArticleData } from '@/types/strapi';

export type BlogArticleVariant = 'default' | 'preview' | 'featured';

export interface BaseBlogArticleCardProps {
  data: BlogArticleData;
}

export interface PreviewBlogArticleCardProps extends BaseBlogArticleCardProps {
  highlight?: string;
  variant: 'preview';
}

export type BlogArticleCardProps = PreviewBlogArticleCardProps & {
  variant: BlogArticleVariant;
};
