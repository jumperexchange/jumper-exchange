'use client';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import { JUMPER_LEARN_PATH } from '@/const/urls';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import '@/i18n/i18next-init-client';
import { useMenuStore } from '@/stores/menu';
import { useRouter } from 'next/navigation';

export const LearnPage = ({ carouselArticles, featuredArticle, url }) => {
  const { trackEvent } = useUserTracking();
  const { closeAllMenus } = useMenuStore((state) => state);
  const router = useRouter();

  const handleFeatureCardClick = (featuredArticle) => {
    console.log('handle click');
    // trackEvent({
    //   category: TrackingCategory.BlogFeaturedArticle,
    //   label: 'click-featured-article',
    //   action: TrackingAction.ClickFeaturedArticle,
    //   data: { [TrackingEventParameter.ArticleID]: featuredArticle[0]?.id },
    //   disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    // });
    router.push(`${JUMPER_LEARN_PATH}/${featuredArticle[0]?.attributes.Slug}`);
    // closeAllMenus();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <FeaturedArticle
        url={url}
        featuredArticle={featuredArticle.data}
        handleFeatureCardClick={() =>
          handleFeatureCardClick(featuredArticle.data)
        }
      />
      <BlogCarousel url={url} data={carouselArticles.data} />
      <JoinDiscordBanner />
      {/* <BlogArticlesBoard /> */}
      {/* <PoweredBy /> */}
      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </>
  );
};
