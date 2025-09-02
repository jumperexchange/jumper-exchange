import { FC } from 'react';
import { TrackingKeys } from '../types';
import { IconButtonPrimary } from '@/components/IconButton.style';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { CtaContainer, CtaTitle } from '../RichBlocks.style';

interface CTARendererProps {
  text: string;
  trackingKeys?: TrackingKeys['cta'];
}

export const CTARenderer: FC<CTARendererProps> = ({ text, trackingKeys }) => {
  // Regular expressions to extract title and url strings
  const titleRegex = /title="(.*?)"/;
  const urlRegex = /url="(.*?)"/;

  // Extract title and url strings using regular expressions
  const titleMatch = text.match(titleRegex);
  const urlMatch = text.match(urlRegex);

  // Check if matches were found and extract strings
  const title = titleMatch?.[1];
  const url = urlMatch ? urlMatch[1] : undefined;

  const trackingKeysWithDefaults = {
    category: TrackingCategory.BlogArticle,
    action: TrackingAction.ClickBlogCTA,
    label: 'click-blog-cta',
    ...(trackingKeys || {}),
    data: {
      [TrackingEventParameter.ArticleTitle]: title || '',
      [TrackingEventParameter.ArticleID]: '',
      ...(trackingKeys?.data || {}),
    },
  };

  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const handleClick = () => {
    trackEvent({
      category: trackingKeysWithDefaults.category,
      action: trackingKeysWithDefaults.action,
      label: trackingKeysWithDefaults.label,
      data: trackingKeysWithDefaults.data,
    });
  };
  return (
    <Link style={{ textDecoration: 'none' }} href={url || '/'}>
      <CtaContainer onClick={handleClick}>
        <CtaTitle>{title ?? t('blog.jumperCta')}</CtaTitle>
        <IconButtonPrimary onClick={handleClick}>
          <ArrowForwardIcon
            sx={(theme) => ({
              width: '28px',
              height: '28px',
              color: (theme.vars || theme).palette.white.main,
            })}
          />
        </IconButtonPrimary>
      </CtaContainer>
    </Link>
  );
};
