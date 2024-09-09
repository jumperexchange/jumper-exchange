import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import Link from 'next/link';
import type { AuthorData } from 'src/types/strapi';
import { BlogAuthorSocialsContainer } from './BlogAuthorSocials.style';

import { IconButtonTertiary } from 'src/components/IconButton.style';

interface BlogAuthorSocialsProps {
  author?: AuthorData;
}

export const BlogAuthorSocials = ({ author }: BlogAuthorSocialsProps) => {
  return (author?.data && author.data.attributes.Twitter) ||
    (author?.data && author.data.attributes.LinkedIn) ? (
    <BlogAuthorSocialsContainer>
      {author.data.attributes.LinkedIn ? (
        <Link href={author.data.attributes.LinkedIn} target="_blank">
          <IconButtonTertiary sx={{ width: '24px', height: '24px' }}>
            <LinkedInIcon sx={{ width: '14px' }} />
          </IconButtonTertiary>
        </Link>
      ) : null}
      {author.data.attributes.Twitter ? (
        <Link href={author.data.attributes.Twitter} target="_blank">
          <IconButtonTertiary sx={{ width: '24px', height: '24px' }}>
            <XIcon sx={{ width: '14px' }} />
          </IconButtonTertiary>
        </Link>
      ) : null}
    </BlogAuthorSocialsContainer>
  ) : null;
};
