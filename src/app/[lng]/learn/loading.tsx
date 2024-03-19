'use client';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import { PoweredBy } from '@/components/PoweredBy/PoweredBy';
import '@/i18n/i18next-init-client';

const loading = () => {
  return (
    <>
      <FeaturedArticle url={undefined} featuredArticle={undefined} />
      <BlogCarousel url={undefined} data={undefined} />
      <JoinDiscordBanner />
      {/* <BlogArticlesBoard /> */}
      <PoweredBy />
      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </>
  );
};

export default loading;
