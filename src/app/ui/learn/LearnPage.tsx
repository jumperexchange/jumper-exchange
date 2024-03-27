'use client';
import { BackgroundGradient } from '@/components/BackgroundGradient/BackgroundGradient';
import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { FeaturedArticle } from '@/components/Blog/FeaturedArticle/FeaturedArticle';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import { Navbar } from '@/components/Navbar/Navbar';
import { PoweredBy } from '@/components/PoweredBy/PoweredBy';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { WalletProvider } from '@/providers/WalletProvider/WalletProvider';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { GetArticlesResponse } from 'src/app/lib/getArticles';

interface LearnPageProps {
  carouselArticles: GetArticlesResponse;
  featuredArticle: StrapiResponse<BlogArticleData>;
  url: string;
}

const LearnPage = ({
  carouselArticles,
  featuredArticle,
  url,
}: LearnPageProps) => {
  return (
    <>
      <FeaturedArticle
        url={url}
        featuredArticle={featuredArticle.data}
        // handleFeatureCardClick={() =>
        //   handleFeatureCardClick(featuredArticle.data)
        // }
      />
      <BlogCarousel url={url} data={carouselArticles?.data} />
      <JoinDiscordBanner />
      {/* <BlogArticlesBoard /> */}
    </>
  );
};

const LearnPageWrapper = ({
  carouselArticles,
  featuredArticle,
  url,
}: LearnPageProps) => {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <WalletProvider>
          <BackgroundGradient />
          <Navbar />
          <LearnPage
            carouselArticles={carouselArticles}
            featuredArticle={featuredArticle}
            url={url}
          />
          <PoweredBy />
        </WalletProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default LearnPageWrapper;
