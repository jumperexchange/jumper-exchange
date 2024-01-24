import type { Breakpoint } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/Layout';
import {
  BlogArticleCard,
  BlogHighlights,
  CustomColor,
  JoinDiscordBanner,
  SlideshowContainer,
} from 'src/components';
import { BlogArticleCardSkeleton } from 'src/components/BlogArticleCard/BlogArticleCardSkeleton';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData } from 'src/types';

export const BlogPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: blogArticles, url } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    queryKey: 'blog-articles',
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

      <SlideshowContainer styles={{ height: 448 }}>
        {blogArticles ? (
          blogArticles?.map((article, index) => {
            return (
              <BlogArticleCard
                baseUrl={url}
                key={`blog-page-article-${index}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
              />
            );
          })
        ) : (
          <>
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
          </>
        )}
      </SlideshowContainer>
      <JoinDiscordBanner />

      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </Layout>
  );
};
