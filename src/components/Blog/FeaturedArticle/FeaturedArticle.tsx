import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  JUMPER_LEARN_PATH,
  STRAPI_BLOG_ARTICLES,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useStrapi, useUserTracking } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool, type BlogArticleData } from 'src/types';
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

export const FeaturedArticle = () => {
  const { trackEvent } = useUserTracking();
  const { data: featuredArticle, url } = useStrapi<BlogArticleData>({
    contentType: STRAPI_BLOG_ARTICLES,
    queryKey: ['blog-articles'],
    filterFeaturedArticle: true,
  });
  const [imgLoaded, setImgLoaded] = useState(false);
  const { t } = useTranslation();
  const { closeAllMenus } = useMenuStore((state) => state);
  const navigate = useNavigate();
  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.BlogFeaturedArticle,
      label: 'click-featured-article',
      action: TrackingAction.ClickFeaturedArticle,
      data: { [TrackingEventParameter.ArticleID]: featuredArticle[0]?.id },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    closeAllMenus();
    navigate(`${JUMPER_LEARN_PATH}/${featuredArticle[0]?.attributes.Slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <FeaturedArticleContainer onClick={() => handleClick()}>
      <FeaturedArticleImage
        onLoad={handleImgLoaded}
        src={`${url.origin}${featuredArticle[0]?.attributes.Image.data.attributes.formats.medium.url}`}
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
            <FeaturedArticleMetaDate variant="lifiBodyXSmall" component="span">
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
  ) : (
    <FeaturedArticleSkeleton />
  );
};
