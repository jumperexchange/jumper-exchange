'use client';

import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import type { StrapiResponseData, BlogArticleData } from '@/types/strapi';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface LearnPageBlogCarouselProps {
  articles: StrapiResponseData<BlogArticleData> | undefined;
}

export const LearnPageBlogCarousel: FC<LearnPageBlogCarouselProps> = ({
  articles,
}) => {
  const { t } = useTranslation();

  return <BlogCarousel title={t('blog.recentPosts')} data={articles} />;
};
