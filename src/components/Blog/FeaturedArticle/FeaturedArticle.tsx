'use client';
import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Tag } from '@/components/Tag.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { BlogArticleData } from '@/types/strapi';
import { readingTime } from '@/utils/readingTime';
import RouterLink from 'next/link';
import { JUMPER_LEARN_PATH } from 'src/const/urls';
import useClient from 'src/hooks/useClient';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  FeaturedArticleContent,
  FeaturedArticleDetails,
  FeaturedArticleImage,
  FeaturedArticleLink,
  FeaturedArticleMetaContainer,
  FeaturedArticleMetaDate,
  FeaturedArticleSkeleton,
  FeaturedArticleSubtitle,
  FeaturedArticleTitle,
} from '.';

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

  const formattedDate =
    featuredArticle &&
    t('format.shortDate', {
      value: new Date(
        featuredArticle?.publishedAt || featuredArticle?.createdAt,
      ),
    });

  const minRead = featuredArticle && readingTime(featuredArticle?.WordCount);

  return featuredArticle ? (
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
            {featuredArticle?.tags.slice(0, 1).map((el, index) => (
              <Tag
                key={`blog-highlights-tag-${index}`}
                variant="bodyMediumStrong"
              >
                {el?.Title}
              </Tag>
            ))}
            <FeaturedArticleMetaContainer>
              {isClient ? (
                <FeaturedArticleMetaDate variant="bodyXSmall" component="span">
                  {formattedDate}
                </FeaturedArticleMetaDate>
              ) : (
                <Skeleton
                  component="span"
                  sx={{
                    width: '96px',
                    transform: 'unset',
                    borderRadius: '16px',
                    marginRight: '12px',
                  }}
                />
              )}

              <Typography
                variant="bodyXSmall"
                component="span"
                fontSize={'inherit'}
              >
                {t('blog.minRead', { minRead: minRead })}
              </Typography>
            </FeaturedArticleMetaContainer>
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
  ) : (
    <FeaturedArticleSkeleton />
  );
};
