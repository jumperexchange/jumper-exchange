import type { Breakpoint } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/Layout';
import {
  BlogArticlesBoard,
  BlogCarousel,
  BlogHighlights,
  CustomColor,
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
    sort: 'desc',
    pagination: { page: 1, pageSize: 6, withCount: false },
  });

  return (
    <Layout hideNavbarTabs={true}>
      <CustomColor
        variant={'lifiBrandHeaderXLarge'}
        sx={{
          margin: theme.spacing(16, 2.5, 0),
          [theme.breakpoints.up('md' as Breakpoint)]: {
            margin: theme.spacing(16, 6, 0),
          },
          textAlign: 'center',
        }}
      >
        {t('blog.title')}
      </CustomColor>
      <Typography
        variant={'lifiBodyXLarge'}
        sx={{
          textAlign: 'center',
          margin: theme.spacing(2, 2.5, 0),
          [theme.breakpoints.up('md' as Breakpoint)]: {
            margin: theme.spacing(4, 6, 0),
          },
        }}
      >
        {t('blog.subtitle')}
      </Typography>
      <BlogHighlights />
      <BlogCarousel url={url} data={recentArticles} />
      <JoinDiscordBanner />
      <BlogArticlesBoard />
      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </Layout>
  );
};
