import { Grid, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/Layout';
import { BackgroundGradient, BlogCard, CustomColor } from 'src/components';
import { useStrapiQuery } from 'src/hooks';
import type { BlogArticleData } from 'src/types';

export const BlogPage = () => {
  const { t } = useTranslation();
  const { data: blogArticles, url } = useStrapiQuery({
    contentType: 'blog-articles',
  });

  const theme = useTheme();
  console.log('blogArticles', blogArticles);
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
      <Grid
        container
        display="grid"
        justifyContent="center"
        // justifyItems="center"
        m={theme.spacing(4, 0)}
        gridTemplateColumns={'512px 512px'}
        gap={theme.spacing(6)}
      >
        {blogArticles?.map((article: BlogArticleData) => {
          return (
            <Grid
              item
              xs={6}
              md={6}
              width="512px"
              minWidth="512px"
              padding={`0`}
            >
              <BlogCard
                title={article.attributes.Title}
                subtitle={article.attributes.Subtitle}
                content={article.attributes.Content}
                tags={article.attributes.tags}
                slug={article.attributes.Slug}
                publishedAt={article.attributes.publishedAt}
                createdAt={article.attributes.createdAt}
                image={article.attributes.Image}
                baseUrl={url.origin}
              />
            </Grid>
          );
        })}
      </Grid>
      <BackgroundGradient />
    </Layout>
  );
};
