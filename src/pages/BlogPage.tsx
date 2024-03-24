import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import {
  BlogCarousel,
  FeaturedArticle,
  JoinDiscordBanner,
  PoweredBy,
} from 'src/components';
import { STRAPI_BLOG_ARTICLES } from 'src/const';
import { useCookie3, useInitUserTracking, useStrapi } from 'src/hooks';
import type { BlogArticleData } from 'src/types';

export const BlogPage = () => {
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
    pagination: { page: 1, pageSize: 20, withCount: false },
  });

  return (
    <Layout hideNavbarTabs={true} redirectToLearn={true}>
      <FeaturedArticle />
      <BlogCarousel url={url} data={recentArticles} />
      <JoinDiscordBanner />
      {/* <BlogArticlesBoard /> */}
      <PoweredBy />
      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </Layout>
  );
};
