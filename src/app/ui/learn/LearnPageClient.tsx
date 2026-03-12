'use client';

import { BlogCarousel } from '@/components/Blog/BlogCarousel/BlogCarousel';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner/JoinDiscordBanner';
import type {
  BlogArticleData,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import { LearnPageArticlesSection } from './LearnPageArticlesSection/LearnPageArticlesSection';
import { LearnFilteringProvider } from '../../../providers/LearnProvider/filtering/LearnFilteringContext';

interface LearnPageClientProps {
  carouselArticles: StrapiResponse<BlogArticleData>;
  tags: StrapiResponse<TagAttributes>;
}

export const LearnPageClient = ({
  carouselArticles,
  tags,
}: LearnPageClientProps) => {
  const { t } = useTranslation();

  return (
    <>
      <BlogCarousel
        title={t('blog.recentPosts')}
        data={carouselArticles?.data}
      />
      <JoinDiscordBanner sx={{ margin: '0 !important' }} />
      <LearnFilteringProvider tags={tags}>
        <LearnPageArticlesSection />
      </LearnFilteringProvider>
    </>
  );
};
