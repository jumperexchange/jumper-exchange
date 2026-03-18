import type { BlogArticleData } from '@/types/strapi';

export type BlogArticleVariant = 'default' | 'preview' | 'featured';

interface LoadingBlogArticleCardProps {
  isLoading: true;
  data?: null;
}

interface LoadedBlogArticleCardProps {
  isLoading?: false;
  data: BlogArticleData;
}

export type BaseBlogArticleCardProps =
  | LoadingBlogArticleCardProps
  | LoadedBlogArticleCardProps;

export type PreviewBlogArticleCardProps = BaseBlogArticleCardProps & {
  highlight?: string;
  variant: 'preview';
};

export type BlogArticleCardProps = PreviewBlogArticleCardProps & {
  variant: BlogArticleVariant;
};
