import { Typography, useTheme } from '@mui/material';
import type { RootNode } from '@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { useTranslation } from 'react-i18next';
import { ArticleJsonSchema, ShareArticleIcons, Tag } from 'src/components';
import { type AuthorData, type StrapiImageData, type TagData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import {
  BlogArticlAuthorName,
  BlogArticlAuthorNameSkeleton,
  BlogArticlAuthorRole,
  BlogArticlAuthorRoleSkeleton,
  BlogArticleAuthorLabel,
  BlogArticleAuthorLabelSkeleton,
  BlogArticleContainer,
  BlogArticleContentContainer,
  BlogArticleContentSkeleton,
  BlogArticleHeaderMeta,
  BlogArticleHeaderMetaDate,
  BlogArticleHeaderTagSkeleton,
  BlogArticleImage,
  BlogArticleImageContainer,
  BlogArticleImageSkeleton,
  BlogArticleMetaSkeleton,
  BlogArticleSubtitle,
  BlogArticleSubtitleSkeleton,
  BlogArticleTitle,
  BlogArticleTitleSkeleton,
  BlogAuthorAvatar,
  BlogAuthorAvatarSkeleton,
  BlogAuthorContainer,
  BlogAuthorMetaWrapper,
  BlogAuthorWrapper,
  BlogMetaContainer,
  Divider,
} from './BlogArticle.style';

import { CustomRichBlocks } from '..';

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
            <BlogArticleHeaderTagSkeleton variant="rectangular" />
          )}
          {!!createdAt ? (
            <>
              <BlogArticleHeaderMetaDate variant="lifiBodyXSmall" as="span">
                {formatDate(publishedAt || createdAt)}
              </BlogArticleHeaderMetaDate>
              <Typography variant="lifiBodyXSmall" component="span">
                {t('blog.minRead', { minRead: minRead })}
              </Typography>
            </>
          ) : (
            <BlogArticleMetaSkeleton variant="text" />
          )}
        </BlogArticleHeaderMeta>
        {title ? (
          <BlogArticleTitle>{title}</BlogArticleTitle>
        ) : (
          <BlogArticleTitleSkeleton />
        )}
        {subtitle ? (
          <BlogArticleSubtitle variant="lifiHeaderMedium">
            {subtitle}
          </BlogArticleSubtitle>
        ) : (
          <BlogArticleSubtitleSkeleton variant="text" />
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
              <BlogArticleAuthorLabelSkeleton variant="text" />
            )}
          </BlogAuthorContainer>
          <ShareArticleIcons title={title} slug={slug} />
        </BlogMetaContainer>
      </BlogArticleContainer>

      <BlogArticleImageContainer>
        {image?.data ? (
          <BlogArticleImage
            src={`${baseUrl}${image.data.attributes?.url}`}
            alt={image?.data.attributes?.alternativeText}
          />
        ) : (
          <BlogArticleImageSkeleton />
        )}
      </BlogArticleImageContainer>
      <BlogArticleContainer>
        <BlogArticleContentContainer>
          {content ? (
            <CustomRichBlocks baseUrl={baseUrl} content={content} />
          ) : (
            <BlogArticleContentSkeleton variant="text" />
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
