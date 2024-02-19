import { Skeleton, Typography, useTheme } from '@mui/material';
import type { RootNode } from '@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { useTranslation } from 'react-i18next';
import {
  ArticleJsonSchema,
  CustomRichBlocks,
  ShareArticleIcons,
  Tag,
} from 'src/components';
import { type AuthorData, type StrapiImageData, type TagData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import {
  BlogArticlAuthorName,
  BlogArticlAuthorNameSkeleton,
  BlogArticlAuthorRole,
  BlogArticlAuthorRoleSkeleton,
  BlogArticleAuthorLabel,
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleHeaderMeta,
  BlogArticleImage,
  BlogArticleImageContainer,
  BlogArticleImageSkeleton,
  BlogArticleSubtitle,
  BlogArticleTitle,
  BlogAuthorAvatar,
  BlogAuthorAvatarSkeleton,
  BlogAuthorContainer,
  BlogAuthorMetaWrapper,
  BlogAuthorWrapper,
  BlogMetaContainer,
  Divider,
} from './BlogArticle.style';

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
  const { t } = useTranslation();

  return (
    <>
      <BlogArticleContainer>
        <BlogArticleHeaderMeta>
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
                sx={{
                  marginLeft: theme.spacing(3),
                  '&:after': {
                    content: '"•"',
                    margin: theme.spacing(0, 1),
                  },
                }}
              >
                {formatDate(publishedAt || createdAt)}
              </Typography>
              <Typography variant="lifiBodyXSmall" component="span">
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
        </BlogArticleHeaderMeta>
        {title ? (
          <BlogArticleTitle>{title}</BlogArticleTitle>
        ) : (
          <Skeleton width={'100%'} height={128} />
        )}
        {subtitle ? (
          <BlogArticleSubtitle variant="lifiHeaderMedium">
            {subtitle}
          </BlogArticleSubtitle>
        ) : (
          <Skeleton width={'100%'} height={120} variant="text" />
        )}
        <BlogMetaContainer>
          <BlogAuthorContainer>
            {author?.data?.attributes?.Avatar.data?.attributes?.url ? (
              <BlogAuthorAvatar
                src={`${baseUrl}${author.data.attributes.Avatar.data.attributes.url}`}
                alt="author-avatar"
              />
            ) : (
              <BlogAuthorAvatarSkeleton variant="rounded" />
            )}
            {author?.data ? (
              <BlogArticleAuthorLabel
                variant="lifiBodyXSmallStrong"
                component="span"
              >
                {author.data?.attributes.Name}
              </BlogArticleAuthorLabel>
            ) : (
              <Skeleton width={80} height={16} variant="text" />
            )}
          </BlogAuthorContainer>
          <ShareArticleIcons title={title} slug={slug} />
        </BlogMetaContainer>
      </BlogArticleContainer>

      {image?.data ? (
        <BlogArticleImageContainer>
          <BlogArticleImage
            src={`${baseUrl}${image.data.attributes?.url}`}
            alt={image?.data.attributes?.alternativeText}
          />
        </BlogArticleImageContainer>
      ) : (
        <BlogArticleImageSkeleton />
      )}
      <BlogArticleContainer>
        <BlogArticleContentContainer>
          {content ? (
            <CustomRichBlocks baseUrl={baseUrl} content={content} />
          ) : (
            <Skeleton width={'100%'} height={'1200px'} />
          )}
          <Divider />
          <BlogAuthorWrapper>
            {author?.data?.attributes?.Avatar.data?.attributes.url ? (
              <BlogAuthorAvatar
                src={`${baseUrl}${author.data.attributes.Avatar.data.attributes.url}`}
                alt="author-avatar"
              />
            ) : (
              <BlogAuthorAvatarSkeleton
                variant="rounded"
                sx={{
                  marginRight: theme.spacing(3),
                }}
              />
            )}
            <BlogAuthorMetaWrapper>
              {author?.data ? (
                <BlogArticlAuthorName component="span">
                  {author.data.attributes?.Name}
                </BlogArticlAuthorName>
              ) : (
                <BlogArticlAuthorNameSkeleton variant="text" />
              )}
              {author?.data ? (
                <BlogArticlAuthorRole variant="lifiBodyXSmall" component="span">
                  {author.data.attributes?.Role}
                </BlogArticlAuthorRole>
              ) : (
                <BlogArticlAuthorRoleSkeleton variant="text" />
              )}
            </BlogAuthorMetaWrapper>
          </BlogAuthorWrapper>
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
