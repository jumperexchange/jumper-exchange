import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import XIcon from '@mui/icons-material/X';
import { useUserTracking } from 'src/hooks';

import type { Breakpoint } from '@mui/material';
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
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { InstructionItemProps } from 'src/components';
import {
  ArticleJsonSchema,
  BlogCTA,
  ImageViewer,
  InstructionsAccordion,
  Tag,
  Widget,
} from 'src/components';
import {
  FB_SHARE_URL,
  LINKEDIN_SHARE_URL,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
  X_SHARE_URL,
} from 'src/const';
import {
  EventTrackingTool,
  type AuthorData,
  type MediaAttributes,
  type StrapiImageData,
  type TagData,
} from 'src/types';
import { formatDate, openInNewTab, readingTime } from 'src/utils';
import {
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleImage,
  BlogArticleImageContainer,
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
  const { trackEvent } = useUserTracking();
  const isComponentMounted = useRef(false);
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const handleShareClick = () => {
    navigator.clipboard.writeText(
      `${window.location.host}${location.pathname}`,
    );
    setShowCopyMessage(true);
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action: TrackingAction.ClickShareArticleLink,
      label: 'click-share-blog-article-link',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleCardTitle]: title,
        [TrackingEventParameter.ArticleCardId]: slug,
      },
    });

    // Hide the copy message after 3 seconds
    setTimeout(() => {
      if (isComponentMounted.current) {
        setShowCopyMessage(false);
      }
    }, 3000);
  };

  const handleTwitterClick = () => {
    if (!title) {
      return;
    }
    const xUrl = new URL(X_SHARE_URL);
    xUrl.searchParams.set('url', `${window.location.host}${location.pathname}`);
    xUrl.searchParams.set('title', title);
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action: TrackingAction.ClickShareArticleX,
      label: 'click-share-blog-article-x',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleCardTitle]: title,
        [TrackingEventParameter.ArticleCardId]: slug,
      },
    });
    openInNewTab(xUrl.href);
  };

  const handleFbClick = () => {
    if (!title) {
      return;
    }
    const fbUrl = new URL(FB_SHARE_URL);
    fbUrl.searchParams.set('u', `${window.location.host}${location.pathname}`);
    fbUrl.searchParams.set('title', title);
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action: TrackingAction.ClickShareArticleFB,
      label: 'click-share-blog-article-fb',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleCardTitle]: title,
        [TrackingEventParameter.ArticleCardId]: slug,
      },
    });
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
    trackEvent({
      category: TrackingCategory.BlogArticle,
      action: TrackingAction.ClickShareArticleLinkedIn,
      label: 'click-share-blog-article-linkedin',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
      data: {
        [TrackingEventParameter.ArticleCardTitle]: title,
        [TrackingEventParameter.ArticleCardId]: slug,
      },
    });
    openInNewTab(linkedInUrl.href);
  };

  // Ensure that articles and article are defined before using them
  const customRichBlocks = {
    // You can use the default components to set class names...
    image: (data: ImageData) =>
      baseUrl ? <ImageViewer imageData={data.image} baseUrl={baseUrl} /> : null,
    paragraph: ({ children }: any) => {
      if (children[0].props.text.includes('<JUMPER_CTA')) {
        try {
          const htmlString = children[0].props.text;

          // Regular expressions to extract title and url strings
          const titleRegex = /title="(.*?)"/;
          const urlRegex = /url="(.*?)"/;

          // Extract title and url strings using regular expressions
          const titleMatch = htmlString.match(titleRegex);
          const urlMatch = htmlString.match(urlRegex);

          // Check if matches were found and extract strings
          const title = titleMatch ? titleMatch[1] : null;
          const url = urlMatch ? urlMatch[1] : null;
          return <BlogCTA title={title} url={url} />;
        } catch (error) {
          return;
        }
      } else if (children[0].props.text.includes('<WIDGET>')) {
        return <Widget starterVariant="default" />;
      } else if (children[0].props.text.includes('<INSTRUCTIONS')) {
        try {
          const new_array: InstructionItemProps[] = [];
          let jso = children[0].props.text
            .replace('<INSTRUCTIONS ', '')
            .replace('>', '');

          // Parse the JSON string and push each parsed object into the new_array
          JSON.parse(jso).forEach((obj: InstructionItemProps) => {
            new_array.push(obj);
          });

          return <InstructionsAccordion data={new_array} />;
        } catch (error) {
          return;
        }
      } else {
        return (
          <Typography
            sx={{
              margin: theme.spacing(2, 0),
              fontFamily: 'Inter',
              fontSize: '18px',
              lineHeight: '32px',
              fontWeight: 400,
            }}
          >
            {children}
          </Typography>
        );
      }
    },
    heading: ({ children, level }: any) => {
      switch (level) {
        case 1:
          return (
            <Typography
              variant="h1"
              sx={{
                marginTop: theme.spacing(12),
                marginBottom: theme.spacing(6),
                fontFamily: 'Urbanist, Inter',
                fontSize: '64px',
                lineHeight: '64px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
        case 2:
          return (
            <Typography
              variant="h2"
              sx={{
                marginTop: theme.spacing(6),
                marginBottom: theme.spacing(3),
                fontFamily: 'Urbanist, Inter',
                fontSize: '32px',
                lineHeight: '38px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
        case 3:
          return (
            <Typography
              variant="h3"
              sx={{
                marginTop: theme.spacing(4),
                marginBottom: theme.spacing(2),
                fontFamily: 'Urbanist, Inter',
                fontSize: '28px',
                lineHeight: '32px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
        case 4:
          return (
            <Typography
              variant="h4"
              sx={{
                marginTop: theme.spacing(3),
                marginBottom: theme.spacing(1.5),
                fontFamily: 'Urbanist, Inter',
                fontSize: '22px',
                lineHeight: '26px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
        case 5:
          return (
            <Typography
              variant="h5"
              sx={{
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(1),
                fontFamily: 'Urbanist, Inter',
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
        case 6:
          return (
            <Typography
              variant="h6"
              sx={{
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(0.5),
                fontFamily: 'Urbanist, Inter',
                fontSize: '12px',
                lineHeight: '18px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
        default:
          return (
            <Typography
              variant="h1"
              sx={{
                marginTop: theme.spacing(12),
                marginBottom: theme.spacing(6),
                fontFamily: 'Urbanist, Inter',
                fontSize: '64px',
                lineHeight: '64px',
                fontWeight: 700,
              }}
            >
              {children}
            </Typography>
          );
      }
    },
  };

  return (
    <>
      <BlogArticleContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '32px',
          }}
        >
          {!!tags?.data[0]?.attributes.Title ? (
            <Tag
              color={tags.data[0]?.attributes.TextColor}
              backgroundColor={tags.data[0]?.attributes.BackgroundColor}
              component="span"
              variant="lifiBodySmall"
              key={`blog-article-tag-${tags.data[0]?.id}`}
            >
              <Typography variant="lifiBodyMediumStrong">
                {tags.data[0].attributes?.Title}
              </Typography>
            </Tag>
          ) : (
            <Skeleton />
          )}
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
                  marginLeft: theme.spacing(3),
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
            <Skeleton
              width={146}
              height={14.5}
              variant="text"
              sx={{ marginTop: 1 }}
            />
          )}
        </Box>
        {title ? (
          <Typography
            sx={{
              marginTop: theme.spacing(8),
              fontWeight: 700,
              lineHeight: '64px',
              fontSize: '64px',
              fontFamily: 'Urbanist, Inter', //todo: add font
            }}
          >
            {title}
          </Typography>
        ) : (
          <Skeleton width={'100%'} height={128} />
        )}
        {subtitle ? (
          <Typography
            variant="lifiHeaderMedium"
            sx={{
              marginTop: theme.spacing(8),
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '32px',
              fontFamily: 'Inter',
            }}
          >
            {subtitle}
          </Typography>
        ) : (
          <Skeleton width={'100%'} height={120} variant="text" />
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing(8),
            gap: theme.spacing(2),
            flexDirection: 'column',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              flexDirection: 'row',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {author?.data?.attributes?.Avatar.data?.attributes?.url ? (
              <BlogAuthorAvatar
                src={`${baseUrl}${author.data.attributes.Avatar.data.attributes.url}`}
                alt="author-avatar"
              />
            ) : (
              <Skeleton
                variant="rounded"
                sx={{
                  marginRight: theme.spacing(3),
                  width: '64px',
                  height: '64px',
                  borderRadius: '32px',
                }}
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
                sx={{
                  fontSize: '24px',
                  lineHeight: '28.5px',
                  fontWeight: 700,
                  fontFamily: 'Urbanist, Inter',
                }}
              >
                {author.data?.attributes.Name}
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
                    marginLeft: theme.spacing(1.5),
                    width: '48px',
                    height: '48px',
                    transition: 'background-color 0.3s',
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? theme.palette.alphaDark100.main
                        : theme.palette.alphaLight300.main,
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? theme.palette.alphaDark300.main
                          : theme.palette.alphaLight500.main,
                    },
                  }}
                >
                  <LinkedInIcon sx={{ width: '28px' }} />
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
                    marginLeft: theme.spacing(1.5),
                    width: '48px',
                    height: '48px',
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? theme.palette.alphaDark100.main
                        : theme.palette.alphaLight300.main,
                    transition: 'background-color 0.3s',
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? theme.palette.alphaDark300.main
                          : theme.palette.alphaLight500.main,
                    },
                  }}
                >
                  <FacebookIcon sx={{ width: '28px' }} />
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
                    marginLeft: theme.spacing(1.5),
                    width: '48px',
                    height: '48px',
                    transition: 'background-color 0.3s',
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? theme.palette.alphaDark100.main
                        : theme.palette.alphaLight300.main,
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? theme.palette.alphaDark300.main
                          : theme.palette.alphaLight500.main,
                    },
                  }}
                >
                  <XIcon sx={{ width: '28px' }} />
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
                    marginLeft: theme.spacing(1.5),
                    width: '48px',
                    height: '48px',
                    transition: 'background-color 0.3s',
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? theme.palette.alphaDark100.main
                        : theme.palette.alphaLight300.main,
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? theme.palette.alphaDark300.main
                          : theme.palette.alphaLight500.main,
                    },
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
      </BlogArticleContainer>

      {image?.data ? (
        <BlogArticleImageContainer>
          <BlogArticleImage
            src={`${baseUrl}${image.data.attributes?.url}`}
            alt={image?.data.attributes?.alternativeText}
          />
        </BlogArticleImageContainer>
      ) : (
        <Skeleton
          width={'100%'}
          sx={{ aspectRatio: '4/3', borderRadius: '14px' }}
        />
      )}
      <BlogArticleContainer>
        <BlogArticleContentContainer>
          {content ? (
            <BlocksRenderer
              content={content}
              blocks={customRichBlocks as any}
            />
          ) : (
            <Skeleton sx={{ width: '100%', height: '1200px' }} />
          )}
          <Divider
            sx={{
              borderColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[800],
              margin: theme.spacing(4, 0, 0),
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: theme.spacing(6, 0),
              padding: theme.spacing(0.5),
              paddingRight: theme.spacing(1.5),
              width: 'fit-content',
              borderRadius: '20px',
            }}
          >
            {author?.data?.attributes?.Avatar.data?.attributes.url ? (
              <BlogAuthorAvatar
                src={`${baseUrl}${author.data.attributes.Avatar.data.attributes.url}`}
                alt="author-avatar"
              />
            ) : (
              <Skeleton
                variant="rounded"
                sx={{
                  width: '64px',
                  height: '64px',
                  transform: 'unset',
                  marginRight: theme.spacing(3),
                  borderRadius: '32px',
                }}
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
                  component="span"
                  sx={{
                    color:
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300],
                    fontFamily: 'Urbanist, Inter',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '28px',
                  }}
                >
                  {author.data.attributes?.Name}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: 142, height: 28, transform: 'unset' }}
                />
              )}
              {author?.data ? (
                <Typography
                  variant="lifiBodyXSmall"
                  component="span"
                  sx={{
                    fontSize: '16px',
                    fontWeight: 400,
                    marginTop: theme.spacing(0.5),
                    lineHeight: '20px',
                    color:
                      theme.palette.mode === 'light'
                        ? '#525252' //todo: add to theme colors
                        : theme.palette.grey[300],
                  }}
                >
                  {author.data.attributes?.Role}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{
                    width: 220,
                    height: 20,
                    marginTop: theme.spacing(0.5),
                    transform: 'unset',
                  }}
                />
              )}
            </Box>
          </Box>
        </BlogArticleContentContainer>
      </BlogArticleContainer>
      {image?.data && publishedAt && author?.data && title && createdAt ? (
        <ArticleJsonSchema
          title={title}
          images={[`${baseUrl}${image.data.attributes?.url}`]}
          datePublished={publishedAt || createdAt}
          dateModified={updatedAt || createdAt}
          authorName={author.data.attributes?.Name}
        />
      ) : null}
    </>
  );
};
