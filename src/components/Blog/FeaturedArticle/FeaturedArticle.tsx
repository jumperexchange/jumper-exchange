'use client';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Tag } from '@/components/Tag.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { BlogArticleData } from '@/types/strapi';
import { formatDate } from '@/utils/formatDate';
import { readingTime } from '@/utils/readingTime';
import { JUMPER_LEARN_PATH } from 'src/const/urls';
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
  url: string | undefined;
  featuredArticle: BlogArticleData;
}

export const FeaturedArticle = ({
  featuredArticle,
  url,
}: FeaturedArticleProps) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const handleFeatureCardClick = (featuredArticle: BlogArticleData) => {
    trackEvent({
      category: TrackingCategory.BlogFeaturedArticle,
      label: 'click-featured-article',
      action: TrackingAction.ClickFeaturedArticle,
      data: { [TrackingEventParameter.ArticleID]: featuredArticle?.id },
    });
  };

  const formatedDate =
    featuredArticle &&
    formatDate(
      featuredArticle?.attributes.publishedAt ||
        featuredArticle?.attributes.createdAt,
    );

  const minRead =
    featuredArticle && readingTime(featuredArticle?.attributes.Content);

  return featuredArticle ? (
    <>
      <FeaturedArticleLink
        href={
          featuredArticle.attributes.RedirectURL ??
          `${JUMPER_LEARN_PATH}/${featuredArticle?.attributes.Slug}`
        }
        onClick={() => {
          handleFeatureCardClick(featuredArticle);
        }}
      >
        <FeaturedArticleImage
          // read the following to udnerstand why width and height are set to 0, https://github.com/vercel/next.js/discussions/18474#discussioncomment-5501724
          width={0}
          height={0}
          sizes="100vw"
          priority
          src={`${url}${featuredArticle?.attributes.Image.data.attributes.formats.medium.url}`}
          alt={
            featuredArticle.attributes.Image.data.attributes.alternativeText ??
            featuredArticle.attributes.Title
          }
        />
        <FeaturedArticleContent>
          <FeaturedArticleDetails>
            {featuredArticle.attributes.tags.data
              .slice(0, 1)
              .map((el, index) => (
                <Tag
                  key={`blog-highlights-tag-${index}`}
                  variant="bodyMediumStrong"
                >
                  {el.attributes.Title}
                </Tag>
              ))}
            <FeaturedArticleMetaContainer>
              <FeaturedArticleMetaDate variant="bodyXSmall" component="span">
                {formatedDate}
              </FeaturedArticleMetaDate>
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
              {featuredArticle.attributes.Title}
            </FeaturedArticleTitle>
          </Box>
          <Box>
            <FeaturedArticleSubtitle>
              {featuredArticle.attributes.Subtitle}
            </FeaturedArticleSubtitle>
          </Box>
        </FeaturedArticleContent>
      </FeaturedArticleLink>
    </>
  ) : (
    <FeaturedArticleSkeleton />
  );
};
