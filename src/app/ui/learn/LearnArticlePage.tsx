'use client';

import Background from '@/components/Background';
import { BlogBackgroundGradient } from '@/components/BackgroundGradient';
import { BlogArticle } from '@/components/Blog/BlogArticle/BlogArticle';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData } from '@/types/strapi';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BlogArticleSection,
  BlogArticleWrapper,
} from './LearnArticlePage.style';

interface LearnArticlePageProps {
  article: BlogArticleData;
  articles: BlogArticleData[];
  url: string;
}

const LearnArticlePage = ({
  article,
  articles,
  url,
}: LearnArticlePageProps) => {
  const { t } = useTranslation();

  return (
    <>
      <BlogArticleWrapper>
        <BlogBackgroundGradient />
        <BlogArticle
          article={article}
          baseUrl={url}
        />
      </BlogArticleWrapper>
      <BlogArticleSection>
        <Box component={Background} sx={{ position: 'absolute' }} />
        {articles.length > 2 && (
          <BlogCarousel
            title={t('blog.similarPosts')}
            showAllButton={true}
            data={articles}
            url={url}
          />
        )}
        <JoinDiscordBanner />
      </BlogArticleSection>
    </>
  );
};

export default LearnArticlePage;
