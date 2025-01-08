'use client';

import Background from '@/components/Background';
import { BlogBackgroundGradient } from '@/components/BackgroundGradient';
import { BlogArticle } from '@/components/Blog/BlogArticle/BlogArticle';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type { BlogArticleData } from '@/types/strapi';
import type { ThemeMode } from '@/types/theme';
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
  activeThemeMode?: ThemeMode;
}

const LearnArticlePage = ({
  article,
  articles,
  url,
  activeThemeMode,
}: LearnArticlePageProps) => {
  const { t } = useTranslation();

  return (
    <>
      <BlogArticleWrapper>
        <BlogBackgroundGradient />
        <BlogArticle
          subtitle={article?.attributes.Subtitle}
          title={article?.attributes.Title}
          content={article?.attributes.Content}
          slug={article?.attributes.Slug}
          id={article?.id}
          author={article?.attributes.author}
          publishedAt={article?.attributes.publishedAt}
          createdAt={article?.attributes.createdAt}
          updatedAt={article?.attributes.updatedAt}
          tags={article?.attributes.tags}
          image={article?.attributes.Image}
          baseUrl={url}
          activeThemeMode={activeThemeMode}
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
