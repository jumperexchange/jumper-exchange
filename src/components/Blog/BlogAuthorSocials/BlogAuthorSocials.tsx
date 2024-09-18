import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import Link from 'next/link';
import type { AuthorData } from 'src/types/strapi';
import { BlogAuthorSocialsContainer } from './BlogAuthorSocials.style';

import { IconButtonTertiary } from 'src/components/IconButton.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';

interface BlogAuthorSocialsProps {
  author?: AuthorData;
  source: string;
  articleId?: number;
}

export const BlogAuthorSocials = ({
  author,
  source,
  articleId,
}: BlogAuthorSocialsProps) => {
  const { trackEvent } = useUserTracking();

  const handleClickLink = ({
    action,
    label,
    url,
  }: {
    action: string;
    label: string;
    url: string;
  }) => {
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action: action,
      label: `click_author-socials-links-${label}`,
      data: {
        [TrackingEventParameter.AuthorName]: author?.data.attributes.Name || '',
        [TrackingEventParameter.AuthorId]: author?.data.id || '',
        [TrackingEventParameter.PageloadURL]: url,
        [TrackingEventParameter.PageloadDestination]: label,
        [TrackingEventParameter.PageloadSource]: source,
        [TrackingEventParameter.ArticleID]: articleId || 0,
      },
    });
  };

  return (author?.data && author.data.attributes.Twitter) ||
    (author?.data && author.data.attributes.LinkedIn) ? (
    <BlogAuthorSocialsContainer className="blog-author-socials">
      {author.data.attributes.LinkedIn && (
        <Link href={author.data.attributes.LinkedIn} target="_blank">
          <IconButtonTertiary
            aria-label="linkedin"
            onClick={() =>
              handleClickLink({
                action: TrackingAction.ClickAuthorsLinkedIn,
                label: 'linkedin',
                url: author.data.attributes.LinkedIn || '',
              })
            }
            sx={{ width: '24px', height: '24px' }}
          >
            <LinkedInIcon sx={{ width: '14px' }} />
          </IconButtonTertiary>
        </Link>
      )}
      {author.data.attributes.Twitter && (
        <Link
          href={author.data.attributes.Twitter}
          target="_blank"
          style={{
            ...(author.data.attributes.LinkedIn && { marginLeft: 4 }),
          }}
        >
          <IconButtonTertiary
            aria-label="X"
            onClick={() =>
              handleClickLink({
                action: TrackingAction.ClickAuthorsX,
                label: 'x',
                url: author.data.attributes.Twitter || '',
              })
            }
            sx={{
              width: '24px',
              height: '24px',
            }}
          >
            <XIcon sx={{ width: '14px' }} />
          </IconButtonTertiary>
        </Link>
      )}
    </BlogAuthorSocialsContainer>
  ) : null;
};
