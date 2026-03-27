'use client';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { BlogArticleData } from '@/types/strapi';
import RouterLink from 'next/link';
import { JUMPER_LEARN_PATH } from 'src/const/urls';
import useClient from 'src/hooks/useClient';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  FeaturedArticleContent,
  FeaturedArticleDetails,
  FeaturedArticleImage,
  FeaturedArticleLink,
  FeaturedArticleSubtitle,
  FeaturedArticleTitle,
} from './FeaturedArticle.style';
import { FeaturedArticleSkeleton } from './FeaturedArticleSkeleton';
import { BlogArticleMetadata } from '../BlogArticleMetadata/BlogArticleMetadata';
import { BadgeSize } from '@/components/Badge/Badge.styles';
import { BlogArticleMetadataSkeleton } from '../BlogArticleMetadata/BlogArticleMetadataSkeleton';

interface FeaturedArticleProps {
  featuredArticle: BlogArticleData;
}

export const FeaturedArticle = ({ featuredArticle }: FeaturedArticleProps) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const isClient = useClient();
  const baseUrl = getStrapiBaseUrl();

  const handleFeatureCardClick = (featuredArticle: BlogArticleData) => {
    trackEvent({
      category: TrackingCategory.BlogFeaturedArticle,
      label: 'click-featured-article',
      action: TrackingAction.ClickFeaturedArticle,
      data: { [TrackingEventParameter.ArticleID]: featuredArticle?.id },
    });
  };

  if (!featuredArticle) {
    return <FeaturedArticleSkeleton />;
  }

  return (
    <>
      <FeaturedArticleLink
        as={RouterLink}
        href={
          featuredArticle?.RedirectURL ??
          `${JUMPER_LEARN_PATH}/${featuredArticle?.Slug}`
        }
        onClick={() => {
          handleFeatureCardClick(featuredArticle);
        }}
      >
        <FeaturedArticleImage
          // read the following to understand why width and height are set to 0, https://github.com/vercel/next.js/discussions/18474#discussioncomment-5501724
          width={0}
          height={0}
          sizes="100vw"
          priority
          src={`${baseUrl}${featuredArticle?.Image?.formats?.medium.url || featuredArticle?.Image?.url}`}
          alt={
            featuredArticle?.Image?.alternativeText ?? featuredArticle?.Title
          }
        />
        <FeaturedArticleContent>
          <FeaturedArticleDetails>
            {isClient ? (
              <BlogArticleMetadata
                article={featuredArticle}
                tagSize={BadgeSize.XL}
                metaVariant="bodyMedium"
                sx={(theme) => ({
                  flexDirection: 'column',
                  gap: 3,
                  [theme.breakpoints.up('sm')]: {
                    flexDirection: 'row-reverse',
                    gap: 3,
                  },
                })}
              />
            ) : (
              <BlogArticleMetadataSkeleton
                tagSize={BadgeSize.XL}
                metaVariant="bodyMedium"
                sx={(theme) => ({
                  flexDirection: 'column',
                  gap: 3,
                  [theme.breakpoints.up('sm')]: {
                    flexDirection: 'row-reverse',
                    gap: 3,
                  },
                })}
              />
            )}
          </FeaturedArticleDetails>
          <Box>
            <FeaturedArticleTitle variant="headerMedium" as="h2">
              {featuredArticle?.Title}
            </FeaturedArticleTitle>
          </Box>
          <Box>
            <FeaturedArticleSubtitle>
              {featuredArticle?.Subtitle}
            </FeaturedArticleSubtitle>
          </Box>
        </FeaturedArticleContent>
      </FeaturedArticleLink>
    </>
  );
};
