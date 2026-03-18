import type { AuthorData } from '@/types/strapi';
import type { FC, PropsWithChildren } from 'react';
import { BlogAuthorSocials } from './BlogAuthorSocials';
import Typography from '@mui/material/Typography';
import { BaseBlogArticleSkeleton, BlogAuthorAvatar } from './BlogArticle.style';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import Box from '@mui/material/Box';
import { WithSkeleton } from './WithSkeleton';

interface BlogArticleAuthorProps extends PropsWithChildren {
  author?: AuthorData;
  avatarSize?: number;
  articleId?: number;
  source: string;
  showRole?: boolean;
}

export const BlogArticleAuthor: FC<BlogArticleAuthorProps> = ({
  author,
  avatarSize = 64,
  articleId,
  source,
  showRole = false,
}) => {
  const baseUrl = getStrapiBaseUrl();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
      <WithSkeleton
        show={!!author?.Avatar?.url}
        skeleton={
          <BaseBlogArticleSkeleton
            variant="circular"
            height={avatarSize}
            width={avatarSize}
          />
        }
      >
        <BlogAuthorAvatar
          width={avatarSize}
          height={avatarSize}
          src={`${baseUrl}${author?.Avatar?.url}`}
          alt={`${author?.Name || 'Author'}'s avatar`}
        />
      </WithSkeleton>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0.5,
        }}
      >
        <WithSkeleton
          show={!!author}
          skeleton={
            <BaseBlogArticleSkeleton
              variant="text"
              sx={{ width: 142, height: 32 }}
            />
          }
        >
          <Typography
            component="span"
            variant="urbanistBodyXLarge"
            color="textPrimary"
            sx={{ fontWeight: 700 }}
          >
            {author?.Name}
          </Typography>
        </WithSkeleton>

        {showRole && (
          <WithSkeleton
            show={!!author}
            skeleton={
              <BaseBlogArticleSkeleton
                variant="text"
                sx={{ width: 220, height: 20 }}
              />
            }
          >
            <Typography variant="bodyMedium" component="span">
              {author?.Role}
            </Typography>
          </WithSkeleton>
        )}

        <BlogAuthorSocials
          author={author}
          articleId={articleId}
          source={source}
        />
      </Box>
    </Box>
  );
};
