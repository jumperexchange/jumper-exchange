'use client';

import Background from '@/components/Background';
import { BlogBackgroundGradient } from '@/components/BackgroundGradient/BackgroundGradient.style';
import { BlogArticle } from '@/components/Blog/BlogArticle/BlogArticle';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import type { BlogArticleData } from '@/types/strapi';
import { Box, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BlogArticleSection,
  BlogArticleWrapper,
} from './LearnArticlePage.style';
import { BlogArticleBanner } from '@/components/Blog/BlogArticleBanner/BlogArticleBanner';

interface LearnArticlePageProps {
  article: BlogArticleData;
  articles: BlogArticleData[];
}

const LearnArticlePage = ({ article, articles }: LearnArticlePageProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <BlogArticleWrapper>
        <BlogBackgroundGradient />
        <BlogArticle article={article} />
      </BlogArticleWrapper>
      <BlogArticleSection>
        <Box component={Background} sx={{ position: 'absolute' }} />
        {articles.length > 2 && (
          <BlogCarousel
            title={t('blog.similarPosts')}
            data={isMobile ? articles.slice(0, 5) : articles}
          />
        )}
      </BlogArticleSection>
      <BlogArticleSection sx={{ mb: 8 }}>
        <BlogArticleBanner />
      </BlogArticleSection>
    </>
  );
};

export default LearnArticlePage;
