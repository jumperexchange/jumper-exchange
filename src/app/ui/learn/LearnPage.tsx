'use client';
import '@/i18n/i18next-init-client';
import { useRouter } from 'next/navigation';
import { BlogCarousel } from 'src/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from 'src/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from 'src/components/JoinDiscordBanner/JoinDiscordBanner';
import { JUMPER_LEARN_PATH } from 'src/const/urls';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { useMenuStore } from 'src/stores/menu/MenuStore';

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
