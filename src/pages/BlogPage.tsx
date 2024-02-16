import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/Layout';
import {
  BlogArticlesBoard,
  BlogCarousel,
  BlogHighlights,
  JoinDiscordBanner,
} from 'src/components';
import { STRAPI_BLOG_ARTICLES } from 'src/const';
import { useCookie3, useInitUserTracking, useStrapi } from 'src/hooks';
import type { BlogArticleData } from 'src/types';

export const BlogPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  const { data: recentArticles, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles-recent'],
    sort: 'asc',
    pagination: { page: 1, pageSize: 6, withCount: false },
  });

  return (
    <Layout hideNavbarTabs={true}>
      <BlogHighlights />
      <BlogCarousel url={url} data={recentArticles} />
      <JoinDiscordBanner />
      <BlogArticlesBoard />
      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </Layout>
  );
};
