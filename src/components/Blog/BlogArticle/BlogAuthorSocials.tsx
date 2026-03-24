import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import type { AuthorData } from 'src/types/strapi';
import { IconButtonTertiary } from 'src/components/IconButton.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import Box from '@mui/material/Box';
import type { ElementType } from 'react';
import { Link } from '@/components/Link/Link';

interface BlogAuthorSocialsProps {
  author?: AuthorData;
  source: string;
  articleId?: number;
}

const ICON_SX = { width: '14px' };
const BUTTON_SX = { width: '24px', height: '24px' };

const SOCIAL_CONFIG = [
  {
    key: 'LinkedIn' as const,
    label: 'linkedin',
    ariaLabel: 'linkedin',
    action: TrackingAction.ClickAuthorsLinkedIn,
    Icon: LinkedInIcon,
  },
  {
    key: 'Twitter' as const,
    label: 'x',
    ariaLabel: 'X',
    action: TrackingAction.ClickAuthorsX,
    Icon: XIcon,
  },
];

interface SocialLinkProps {
  url: string;
  ariaLabel: string;
  icon: ElementType;
  onClick: () => void;
}

const SocialLink = ({
  url,
  ariaLabel,
  icon: Icon,
  onClick,
}: SocialLinkProps) => {
  const anchorsProps = {
    component: Link,
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    ['aria-label']: ariaLabel,
    onClick,
    sx: BUTTON_SX,
  };
  return (
    <IconButtonTertiary {...anchorsProps}>
      <Icon sx={ICON_SX} />
    </IconButtonTertiary>
  );
};

export const BlogAuthorSocials = ({
  author,
  source,
  articleId,
}: BlogAuthorSocialsProps) => {
  const { trackEvent } = useUserTracking();

  const visibleSocials = SOCIAL_CONFIG.filter(({ key }) => author?.[key]);

  if (!visibleSocials.length) {
    return null;
  }

  const handleClickLink = (action: string, label: string, url: string) => {
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action,
      label: `click_author-socials-links-${label}`,
      data: {
        [TrackingEventParameter.AuthorName]: author?.Name ?? '',
        [TrackingEventParameter.AuthorId]: author?.id ?? '',
        [TrackingEventParameter.PageloadURL]: url,
        [TrackingEventParameter.PageloadDestination]: label,
        [TrackingEventParameter.PageloadSource]: source,
        [TrackingEventParameter.ArticleID]: articleId ?? 0,
      },
    });
  };

  return (
    <Box
      className="blog-author-socials"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(0.5),
      })}
    >
      {visibleSocials.map(({ key, label, ariaLabel, action, Icon }) => {
        const url = author![key]!;
        return (
          <SocialLink
            key={key}
            url={url}
            ariaLabel={ariaLabel}
            icon={Icon}
            onClick={() => handleClickLink(action, label, url)}
          />
        );
      })}
    </Box>
  );
};
