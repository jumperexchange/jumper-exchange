'use client';

import { BackgroundGradient } from '@/components/BackgroundGradient/BackgroundGradient';
import { BlogArticle } from '@/components/Blog/BlogArticle/BlogArticle';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import { PoweredBy } from '@/components/PoweredBy/PoweredBy';
import { STRAPI_BLOG_ARTICLES } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useInitUserTracking } from '@/hooks/userTracking/useInitUserTracking';
import type { BlogArticleData } from '@/types/strapi';
import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface LearnArticlePageProps {
  article: BlogArticleData[];
  url: string;
}

export const LearnArticlePage = ({ article, url }: LearnArticlePageProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  console.log('ARTICLE:', article);

  const { initTracking } = useInitUserTracking();
  // const cookie3 = useCookie3();
  // todo: enable cookie3
  // useEffect(() => {
  //   initTracking({});
  //   cookie3?.trackPageView();
  // }, [cookie3, initTracking]);

  const currentCategories = useMemo(() => {
    return article && article[0]?.attributes.tags.data.map((el) => el?.id);
  }, [article]);

  const { data: articles, isSuccess: articlesIsSuccess } =
    useStrapi<BlogArticleData>({
      contentType: STRAPI_BLOG_ARTICLES,
      queryKey: ['blog-articles'].concat(
        currentCategories?.toString().split(','),
      ),
      filterTag: currentCategories,
    });

  const filteredArticles = useMemo(() => {
    return article && articles?.filter((el) => el.id !== article[0]?.id);
  }, [article, articles]);

  return (
    <>
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
      />
      <Box
        position="relative"
        sx={{
          padding: theme.spacing(6, 2, 0.25),

          [theme.breakpoints.up('sm' as Breakpoint)]: {
            padding: theme.spacing(6, 2, 0.25),
            paddingTop: theme.spacing(12),
          },
          [theme.breakpoints.up('md' as Breakpoint)]: {
            padding: theme.spacing(8, 0, 0.25),
            paddingTop: theme.spacing(12),
          },
        }}
      >
        <BackgroundGradient styles={{ position: 'absolute' }} />
        <BlogCarousel
          title={t('blog.similarPosts')}
          showAllButton={true}
          data={filteredArticles}
          url={url}
        />
        <JoinDiscordBanner />
        <PoweredBy />
      </Box>
    </>
  );
};
