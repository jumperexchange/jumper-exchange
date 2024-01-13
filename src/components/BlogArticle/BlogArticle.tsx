import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import XIcon from '@mui/icons-material/X';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { RootNode } from '@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ArticleJsonSchema } from 'src/components';
import { FB_SHARE_URL, LINKEDIN_SHARE_URL, X_SHARE_URL } from 'src/const';
import type { AuthorData, StrapiImageData, TagData } from 'src/types';
import { formatDate, openInNewTab, readingTime } from 'src/utils';
import {
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleImage,
  BlogAuthorAvatar,
} from './BlogArticle.style';

interface BlogArticleProps {
  title: string;
  subtitle: string;
  content: RootNode[];
  tags: TagData;
  author: AuthorData;
  slug: string;
  publishedAt: string | null;
  updatedAt: string | null;
  createdAt: string;
  image: StrapiImageData;
  baseUrl: string;
}

export const BlogArticle = ({
  title,
  subtitle,
  content,
  author,
  tags,
  publishedAt,
  updatedAt,
  createdAt,
  slug,
  image,
  baseUrl,
}: BlogArticleProps) => {
  const theme = useTheme();
  const minRead = readingTime(content);
  console.log('CONTENT', content);
  const { t } = useTranslation();
  const location = useLocation();

  const handleShareClick = () => {
    navigator.clipboard.writeText(
      `${window.location.host}${location.pathname}`,
    );
  };

  const handleTwitterClick = () => {
    const xUrl = new URL(X_SHARE_URL);
    xUrl.searchParams.set('url', `${window.location.host}${location.pathname}`);
    xUrl.searchParams.set('title', title);
    console.log(xUrl.href);
    openInNewTab(xUrl.href);
  };

  const handleFbClick = () => {
    const fbUrl = new URL(FB_SHARE_URL);
    fbUrl.searchParams.set('u', `${window.location.host}${location.pathname}`);
    fbUrl.searchParams.set('title', title);
    console.log(fbUrl.href);
    openInNewTab(fbUrl.href);
  };

  const handleLinkedInClick = () => {
    const linkedInUrl = new URL(LINKEDIN_SHARE_URL);
    linkedInUrl.searchParams.set('mini', 'true');
    linkedInUrl.searchParams.set(
      'url',
      `${window.location.host}${location.pathname}`,
    );
    linkedInUrl.searchParams.set('title', title);
    console.log(linkedInUrl.href);
    openInNewTab(linkedInUrl.href);
  };

  return (
    <>
      <BlogArticleContainer>
        <Typography
          variant="lifiBodyXSmall"
          component="span"
          color={
            theme.palette.mode === 'light'
              ? theme.palette.grey[800]
              : theme.palette.grey[300]
          }
          sx={{
            '&:after': {
              content: '"•"',
              margin: '0 4px',
            },
          }}
        >
          {formatDate(publishedAt || createdAt)}
        </Typography>
        <Typography
          variant="lifiBodyXSmall"
          component="span"
          mt={theme.spacing(1)}
          color={
            theme.palette.mode === 'light'
              ? theme.palette.grey[800]
              : theme.palette.grey[300]
          }
        >
          {t('blog.minRead', { minRead: minRead })}
        </Typography>
        <Typography variant="lifiHeaderLarge">{title}</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing(1),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlogAuthorAvatar
              src={`${baseUrl}${author.attributes.Avatar.data.attributes.url}`}
              alt="author-avatar"
            />
            <Typography
              variant="lifiBodyXSmallStrong"
              component="span"
              color={
                theme.palette.mode === 'light'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300]
              }
            >
              {author.attributes.Name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleLinkedInClick}
              sx={{
                marginLeft: 0.5,
                width: '40px',
                height: '40px',
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
              }}
            >
              <LinkedInIcon sx={{ width: '18px' }} />
            </IconButton>{' '}
            <IconButton
              onClick={handleFbClick}
              sx={{
                marginLeft: 0.5,
                width: '40px',
                height: '40px',
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
              }}
            >
              <FacebookIcon sx={{ width: '18px' }} />
            </IconButton>
            <IconButton
              onClick={handleTwitterClick}
              sx={{
                marginLeft: 0.5,
                width: '40px',
                height: '40px',
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
              }}
            >
              <XIcon sx={{ width: '18px' }} />
            </IconButton>
            <IconButton
              onClick={handleShareClick}
              sx={{
                marginLeft: 0.5,
                width: '40px',
                height: '40px',
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
              }}
            >
              <ShareIcon sx={{ width: '18px' }} />
            </IconButton>
          </Box>
        </Box>
        <BlogArticleImage
          src={`${baseUrl}${image.data.attributes.url}`}
          alt={image.data.attributes.alternativeText}
        />
        <BlogArticleContentContainer>
          <Typography variant="lifiHeaderMedium">{subtitle}</Typography>
          <BlocksRenderer content={content} />
          <Divider
            sx={{
              borderColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[800],
              margin: theme.spacing(4, 0),
            }}
          ></Divider>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              img: { width: '28px' },
              // background: 'white',
              padding: theme.spacing(0.5),
              paddingRight: theme.spacing(1.5),
              width: 'fit-content',
              borderRadius: '20px',
            }}
          >
            <BlogAuthorAvatar
              src={`${baseUrl}${author.attributes.Avatar.data.attributes.url}`}
              alt="author-avatar"
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="lifiBodyXSmallStrong"
                component="span"
                color={
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]
                }
              >
                {author.attributes.Name}
              </Typography>
              <Typography
                variant="lifiBodyXSmall"
                component="span"
                color={
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]
                }
              >
                {author.attributes.Role}
              </Typography>
            </Box>
          </Box>
        </BlogArticleContentContainer>
      </BlogArticleContainer>
      <ArticleJsonSchema
        title={title}
        images={[`${baseUrl}${image.data.attributes.url}`]}
        datePublished={publishedAt || createdAt}
        dateModified={updatedAt || createdAt}
        authorName={author.attributes.Name}
      />
    </>
  );
};
