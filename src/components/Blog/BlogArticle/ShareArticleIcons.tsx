import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { openInNewTab } from '@/utils/openInNewTab';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import {
  FB_SHARE_URL,
  getSiteUrl,
  LINKEDIN_SHARE_URL,
  X_SHARE_URL,
} from '@/const/urls';
import { WithSkeleton } from './WithSkeleton';
import { ShareArticleIcon } from './ShareArticleIcon';
import {
  ShareIconsContainer,
  ShareIconsSkeletons,
} from './ShareArticleIcons.style';

interface ShareIconsProps {
  title?: string;
  slug?: string;
}

export const ShareArticleIcons = ({ title, slug }: ShareIconsProps) => {
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();
  const { trackEvent } = useUserTracking();
  const isComponentMounted = useRef(false);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const pageUrl = `${getSiteUrl()}${pathname}`;

  const trackShare = (action: TrackingAction, label: string) => {
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action,
      label,
      data: {
        [TrackingEventParameter.ArticleTitle]: title ?? '',
        [TrackingEventParameter.ArticleCardId]: slug ?? '',
      },
    });
  };

  const SHARE_CONFIG = [
    {
      icon: <LinkedInIcon sx={{ width: '28px' }} />,
      tooltipMsg: t('blog.shareLinkedIn'),
      action: TrackingAction.ClickShareArticleLinkedIn,
      label: 'click-share-blog-article-linkedin',
      getUrl: () => {
        const url = new URL(LINKEDIN_SHARE_URL);
        url.searchParams.set('mini', 'true');
        url.searchParams.set('url', pageUrl);
        url.searchParams.set('title', title!);
        return url.href;
      },
    },
    {
      icon: <FacebookIcon sx={{ width: '28px' }} />,
      tooltipMsg: t('blog.shareFb'),
      action: TrackingAction.ClickShareArticleFB,
      label: 'click-share-blog-article-fb',
      getUrl: () => {
        const url = new URL(FB_SHARE_URL);
        url.searchParams.set('u', pageUrl);
        url.searchParams.set('title', title!);
        return url.href;
      },
    },
    {
      icon: <XIcon sx={{ width: '28px' }} />,
      tooltipMsg: t('blog.shareX'),
      action: TrackingAction.ClickShareArticleX,
      label: 'click-share-blog-article-x',
      getUrl: () => {
        const url = new URL(X_SHARE_URL);
        url.searchParams.set('url', pageUrl);
        url.searchParams.set('title', title!);
        return url.href;
      },
    },
  ];

  const handleShareClick = () => {
    navigator.clipboard.writeText(pageUrl);
    setShowCopyMessage(true);
    trackShare(
      TrackingAction.ClickShareArticleLink,
      'click-share-blog-article-link',
    );
    setTimeout(() => {
      if (isComponentMounted.current) {
        setShowCopyMessage(false);
      }
    }, 3000);
  };

  return (
    <WithSkeleton
      show={!!title}
      skeleton={
        <ShareIconsSkeletons
          variant="rectangular"
          sx={{ width: '228px', height: '48px' }}
        />
      }
    >
      <ShareIconsContainer>
        {SHARE_CONFIG.map(({ icon, tooltipMsg, action, label, getUrl }) => (
          <ShareArticleIcon
            key={label}
            handleShare={() => {
              trackShare(action, label);
              openInNewTab(getUrl());
            }}
            tooltipMsg={tooltipMsg}
            icon={icon}
          />
        ))}
        <ShareArticleIcon
          handleShare={handleShareClick}
          tooltipMsg={t('blog.shareLink')}
          icon={
            <LinkIcon
              sx={[
                { width: '28px' },
                showCopyMessage ? { marginLeft: '2px' } : { marginLeft: 0 },
              ]}
            />
          }
          showMsgActive={showCopyMessage}
          showMsg={t('blog.copiedLink')}
        />
      </ShareIconsContainer>
    </WithSkeleton>
  );
};
