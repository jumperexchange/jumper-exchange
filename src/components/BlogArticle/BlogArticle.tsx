import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import XIcon from '@mui/icons-material/X';
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { RootNode } from '@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  ArticleJsonSchema,
  ImageViewer,
  JumperBanner,
  Widget,
} from 'src/components';
import { FB_SHARE_URL, LINKEDIN_SHARE_URL, X_SHARE_URL } from 'src/const';
import type {
  AuthorData,
  MediaAttributes,
  StrapiImageData,
  TagData,
} from 'src/types';
import { formatDate, openInNewTab, readingTime } from 'src/utils';
import {
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleImage,
  BlogAuthorAvatar,
} from './BlogArticle.style';

interface ImageData {
  image: MediaAttributes;
}

interface BlogArticleProps {
  title: string | undefined;
  subtitle: string | undefined;
  content: RootNode[] | undefined;
  tags: TagData | undefined;
  author: AuthorData | undefined;
  slug: string | undefined;
  publishedAt: string | null | undefined;
  updatedAt: string | null | undefined;
  createdAt: string | undefined;
  image: StrapiImageData | undefined;
  baseUrl: string | undefined;
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
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const handleShareClick = () => {
    navigator.clipboard.writeText(
      `${window.location.host}${location.pathname}`,
    );
    setShowCopyMessage(true);

    // Hide the copy message after 3 seconds
    setTimeout(() => {
      setShowCopyMessage(false);
    }, 3000);
  };

  const handleTwitterClick = () => {
    if (!title) {
      return;
    }
    const xUrl = new URL(X_SHARE_URL);
    xUrl.searchParams.set('url', `${window.location.host}${location.pathname}`);
    xUrl.searchParams.set('title', title);
    openInNewTab(xUrl.href);
  };

  const handleFbClick = () => {
    if (!title) {
      return;
    }
    const fbUrl = new URL(FB_SHARE_URL);
    fbUrl.searchParams.set('u', `${window.location.host}${location.pathname}`);
    fbUrl.searchParams.set('title', title);
    openInNewTab(fbUrl.href);
  };

  const handleLinkedInClick = () => {
    if (!title) {
      return;
    }
    const linkedInUrl = new URL(LINKEDIN_SHARE_URL);
    linkedInUrl.searchParams.set('mini', 'true');
    linkedInUrl.searchParams.set(
      'url',
      `${window.location.host}${location.pathname}`,
    );
    linkedInUrl.searchParams.set('title', title);
    openInNewTab(linkedInUrl.href);
  };

  // Ensure that articles and article are defined before using them
  const customRichBlocks = {
    // You can use the default components to set class names...
    image: (data: ImageData) =>
      baseUrl ? <ImageViewer imageData={data.image} baseUrl={baseUrl} /> : null,
    paragraph: ({ children }: any) => {
      if (children[0].props.text.includes('<JUMPER_BANNER>')) {
        return <JumperBanner />;
      } else if (children[0].props.text.includes('<WIDGET>')) {
        return <Widget starterVariant="default" />;
      } else {
        return <p className="text-neutral900 max-w-prose">{children}</p>;
      }
    },
  };

  console.log({
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
  });
  return (
    <>
      <BlogArticleContainer>
        {!!createdAt ? (
          <>
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
            </Typography>{' '}
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
          </>
        ) : (
          <Skeleton width={146} height={14.5} variant="text" />
        )}
        {title ? (
          <Typography variant="lifiHeaderLarge">{title}</Typography>
        ) : (
          <Skeleton width={'100%'} height={128} />
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing(1),
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            onClick={() => console.log('AUTHOR', author)}
          >
            {author?.data ? (
              <BlogAuthorAvatar
                src={`${baseUrl}${author.data.attributes.Avatar.data.attributes.url}`}
                alt="author-avatar"
              />
            ) : (
              <Skeleton
                width={28}
                height={28}
                variant="rounded"
                sx={{ marginRight: theme.spacing(1) }}
              />
            )}
            {author?.data ? (
              <Typography
                variant="lifiBodyXSmallStrong"
                component="span"
                color={
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]
                }
              >
                {author.data.attributes.Name}
              </Typography>
            ) : (
              <Skeleton width={80} height={16} variant="text" />
            )}
          </Box>
          {title ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip
                title={'Share article on LinkedIn'}
                key={`tooltip-share-linkedin`}
                placement="top"
                enterTouchDelay={0}
                arrow
              >
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
                </IconButton>
              </Tooltip>
              <Tooltip
                title={'Share article on Facebook'}
                key={`tooltip-share-facebook`}
                placement="top"
                enterTouchDelay={0}
                arrow
              >
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
              </Tooltip>
              <Tooltip
                title={'Share article on X'}
                key={`tooltip-share-x`}
                placement="top"
                enterTouchDelay={0}
                arrow
              >
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
              </Tooltip>
              <Tooltip
                title={'Share the link'}
                key={`tooltip-share-link`}
                // open={showCopyMessage ? false : undefined}
                // disableFocusListener={showCopyMessage ? false : undefined}
                // disableInteractive={!showCopyMessage ? false : undefined}
                placement="top"
                enterTouchDelay={0}
                arrow
              >
                <IconButton
                  onClick={handleShareClick}
                  sx={{
                    marginLeft: 0.5,
                    width: showCopyMessage ? 'auto' : '40px',
                    ...(showCopyMessage && {
                      borderRadius: '20px',
                    }),
                    height: '40px',
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
                  }}
                >
                  <ShareIcon sx={{ width: '18px' }} />
                  {showCopyMessage && (
                    <Typography
                      variant="lifiBodySmall"
                      marginLeft={1}
                      marginRight={1}
                    >
                      Copied Link
                    </Typography>
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Skeleton
              variant="rectangular"
              width={176}
              height={40}
              sx={{ borderRadius: '20px' }}
            />
          )}
        </Box>
        {image?.data ? (
          <BlogArticleImage
            src={`${baseUrl}${image.data.attributes.url}`}
            alt={image?.data.attributes.alternativeText}
          />
        ) : (
          <Skeleton width={'100%'} height={478} sx={{ borderRadius: '14px' }} />
        )}
        <BlogArticleContentContainer>
          {subtitle ? (
            <Typography variant="lifiHeaderMedium">{subtitle}</Typography>
          ) : (
            <Skeleton width={'100%'} height={120} variant="text" />
          )}
          {content ? (
            <BlocksRenderer
              content={content}
              blocks={customRichBlocks as any}
            />
          ) : (
            <Skeleton width={'100%'} height={1000} />
          )}
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
              padding: theme.spacing(0.5),
              paddingRight: theme.spacing(1.5),
              width: 'fit-content',
              borderRadius: '20px',
            }}
          >
            {author?.data ? (
              <BlogAuthorAvatar
                src={`${baseUrl}${author.data.attributes.Avatar.data.attributes.url}`}
                alt="author-avatar"
              />
            ) : (
              <Skeleton
                width={28}
                height={28}
                variant="rounded"
                sx={{ marginRight: theme.spacing(1) }}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {author?.data ? (
                <Typography
                  variant="lifiBodyXSmallStrong"
                  component="span"
                  color={
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[300]
                  }
                >
                  {author.data.attributes.Name}
                </Typography>
              ) : (
                <Skeleton variant="text" width={90} height={16} />
              )}
              {author?.data ? (
                <Typography
                  variant="lifiBodyXSmall"
                  component="span"
                  color={
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[300]
                  }
                >
                  {author.data.attributes.Role}
                </Typography>
              ) : (
                <Skeleton variant="text" width={90} height={16} />
              )}
            </Box>
          </Box>
        </BlogArticleContentContainer>
      </BlogArticleContainer>
      {image?.data && publishedAt && author?.data && title && createdAt ? (
        <ArticleJsonSchema
          title={title}
          images={[`${baseUrl}${image.data.attributes.url}`]}
          datePublished={publishedAt || createdAt}
          dateModified={updatedAt || createdAt}
          authorName={author.data.attributes.Name}
        />
      ) : null}
    </>
  );
};
