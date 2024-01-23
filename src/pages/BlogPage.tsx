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
        sx={{ marginTop: theme.spacing(16), textAlign: 'center' }}
      >
        {t('blog.title')}
      </CustomColor>
      <Typography
        variant={'lifiBodyXLarge'}
        sx={{ marginTop: theme.spacing(2), textAlign: 'center' }}
      >
        {t('blog.subtitle')}
      </Typography>
      <BlogHighlights />

      <SlideshowContainer>
        {blogArticles?.map((article, index) => (
          <BlogArticleCard
            baseUrl={url}
            key={`blog-page-article-${index}`}
            image={article.attributes.Image}
            title={article.attributes.Title}
            slug={article.attributes.Slug}
          />
        ))}
      </SlideshowContainer>
      <JoinDiscordBanner />

      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </Layout>
  );
};
