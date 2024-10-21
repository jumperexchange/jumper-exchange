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
  article: BlogArticleData[];
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
          subtitle={article[0]?.attributes.Subtitle}
          title={article[0]?.attributes.Title}
          content={article[0]?.attributes.Content}
          slug={article[0]?.attributes.Slug}
          id={article[0]?.id}
          author={article[0]?.attributes.author}
          publishedAt={article[0]?.attributes.publishedAt}
          createdAt={article[0]?.attributes.createdAt}
          updatedAt={article[0]?.attributes.updatedAt}
          tags={article[0]?.attributes.tags}
          image={article[0]?.attributes.Image}
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
