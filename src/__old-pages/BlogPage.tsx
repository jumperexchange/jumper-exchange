import {
  BlogCarousel,
  FeaturedArticle,
  JoinDiscordBanner,
  PoweredBy,
} from '@/components';
import { useInitUserTracking, useStrapi } from '@/hooks';
import { Layout } from 'src/Layout';
import { STRAPI_BLOG_ARTICLES } from 'src/const';
import type { BlogArticleData } from 'src/types';

export const BlogPage = () => {
  const { initTracking } = useInitUserTracking();
  // todo: enable cookie3
  // const cookie3 = useCookie3();

  // useEffect(() => {
  //   initTracking({});
  //   cookie3?.trackPageView();
  // }, [cookie3, initTracking]);

  const { data: recentArticles, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles-recent'],
    sort: 'asc',
    pagination: { page: 1, pageSize: 6, withCount: false },
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
