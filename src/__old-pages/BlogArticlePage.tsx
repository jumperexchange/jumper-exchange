import {
  BackgroundGradient,
  BlogArticle,
  BlogCarousel,
  JoinDiscordBanner,
  PoweredBy,
} from '@/components';
import { useInitUserTracking, useStrapi } from '@/hooks';
import type { Breakpoint } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Layout } from 'src/Layout';
import { STRAPI_BLOG_ARTICLES } from 'src/const';
import type { BlogArticleData } from 'src/types';

export const BlogArticlePage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { initTracking } = useInitUserTracking();
  // const cookie3 = useCookie3();
  const theme = useTheme();

  // todo: enable cookie3
  // useEffect(() => {
  //   initTracking({});
  //   cookie3?.trackPageView();
  // }, [cookie3, initTracking]);
  const {
    data: article,
    url: articleUrl,
    isSuccess: articleIsSuccess,
  } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    filterSlug: id,
    queryKey: ['blog-article', `${id ?? ''}`],
  });
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

  const isSuccess = articleIsSuccess && articlesIsSuccess;

  const filteredArticles = useMemo(() => {
    return article && articles?.filter((el) => el.id !== article[0]?.id);
  }, [article, articles]);

  return (
    <Layout hideNavbarTabs={true} redirectToLearn={true} variant={'blog'}>
      <BlogArticle
        subtitle={isSuccess ? article[0]?.attributes.Subtitle : undefined}
        title={isSuccess ? article[0]?.attributes.Title : undefined}
        content={isSuccess ? article[0]?.attributes.Content : undefined}
        slug={isSuccess ? article[0]?.attributes.Slug : undefined}
        id={isSuccess ? article[0].id : undefined}
        author={!!article ? article[0]?.attributes.author : undefined}
        publishedAt={isSuccess ? article[0]?.attributes.publishedAt : undefined}
        createdAt={isSuccess ? article[0]?.attributes.createdAt : undefined}
        updatedAt={isSuccess ? article[0]?.attributes.updatedAt : undefined}
        tags={isSuccess ? article[0]?.attributes.tags : undefined}
        image={isSuccess ? article[0]?.attributes.Image : undefined}
        baseUrl={articleUrl.origin ?? undefined}
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
          url={articleUrl}
        />
        <JoinDiscordBanner />
        <PoweredBy />
      </Box>
    </Layout>
  );
};
