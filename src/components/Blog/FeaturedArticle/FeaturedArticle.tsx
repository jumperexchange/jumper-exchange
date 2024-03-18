'use client';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import React from 'react';
import { type BlogArticleData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import {
  FeaturedArticleContainer,
  FeaturedArticleContent,
  FeaturedArticleDetails,
  FeaturedArticleImage,
  FeaturedArticleImageSkeleton,
  FeaturedArticleMetaContainer,
  FeaturedArticleMetaDate,
  FeaturedArticleSkeleton,
  FeaturedArticleSubtitle,
  FeaturedArticleTitle,
} from '.';
import { Tag } from '../../Tag.style';

interface FeaturedArticleProps {
  url: URL;
  featuredArticle: BlogArticleData[];
  handleFeatureCardClick: () => void;
}

export const FeaturedArticle = ({
  featuredArticle,
  handleFeatureCardClick,
  url,
}: FeaturedArticleProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { t } = useTranslation();

  const handleImgLoaded = () => {
    setImgLoaded(true);
  };

  const formatedDate =
    featuredArticle &&
    formatDate(
      featuredArticle[0]?.attributes.publishedAt ||
        featuredArticle[0]?.attributes.createdAt,
    );

  const minRead =
    featuredArticle && readingTime(featuredArticle[0]?.attributes.Content);

  return featuredArticle?.length > 0 ? (
    <>
      <FeaturedArticleContainer onClick={handleFeatureCardClick}>
        <FeaturedArticleImage
          onLoad={handleImgLoaded}
          src={`${url}${featuredArticle[0]?.attributes.Image.data.attributes.formats.medium.url}`}
          sx={{ ...(!imgLoaded && { display: 'none' }) }}
          alt={
            featuredArticle[0].attributes.Image.data.attributes.alternativeText
          }
        />
        {!imgLoaded && <FeaturedArticleImageSkeleton />}
        <FeaturedArticleContent>
          <FeaturedArticleDetails>
            {featuredArticle[0].attributes.tags.data
              .slice(0, 1)
              .map((el, index) => (
                <Tag
                  key={`blog-highlights-tag-${index}`}
                  variant="lifiBodyMediumStrong"
                >
                  {el.attributes.Title}
                </Tag>
              ))}
            <FeaturedArticleMetaContainer>
              <FeaturedArticleMetaDate
                variant="lifiBodyXSmall"
                component="span"
              >
                {formatedDate}
              </FeaturedArticleMetaDate>
              <Typography
                variant="lifiBodyXSmall"
                component="span"
                fontSize={'inherit'}
              >
                {t('blog.minRead', { minRead: minRead })}
              </Typography>
            </FeaturedArticleMetaContainer>
          </FeaturedArticleDetails>
          <Box>
            <FeaturedArticleTitle variant="lifiHeaderMedium" as="h2">
              {featuredArticle[0].attributes.Title}
            </FeaturedArticleTitle>
          </Box>
          <Box>
            <FeaturedArticleSubtitle>
              {featuredArticle[0].attributes.Subtitle}
            </FeaturedArticleSubtitle>
          </Box>
        </FeaturedArticleContent>
      </FeaturedArticleContainer>
    </>
  ) : (
    <FeaturedArticleSkeleton />
  );
};
