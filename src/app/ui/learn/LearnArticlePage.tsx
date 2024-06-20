'use client';

import { BlogBackgroundGradient } from '@/components/BackgroundGradient';
import { BackgroundGradient } from '@/components/BackgroundGradient/BackgroundGradient';
import { BlogArticle } from '@/components/Blog/BlogArticle/BlogArticle';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import { useSession } from '@/hooks/useSession';
import type { ThemeModesSupported } from '@/types/settings';
import type { BlogArticleData } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import {
  BlogArticleSection,
  BlogArticleWrapper,
} from './LearnArticlePage.style';

interface LearnArticlePageProps {
  article: BlogArticleData[];
  articles: BlogArticleData[];
  url: string;
  activeTheme?: ThemeModesSupported;
}

const LearnArticlePage = ({
  article,
  articles,
  url,
  activeTheme,
}: LearnArticlePageProps) => {
  const { t } = useTranslation();

  // testing! todo: remove
  const sessionID = useSession();
  console.log('sessionId', sessionID);

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
          activeTheme={activeTheme}
        />
      </BlogArticleWrapper>
      <BlogArticleSection>
        <BackgroundGradient styles={{ position: 'absolute' }} />
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
