import { useTheme } from '@mui/material';
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
  BlogArticleTopHeader,
  BlogAuthorAvatar,
  BlogAuthorAvatarSkeleton,
  BlogAuthorContainer,
  BlogAuthorMetaWrapper,
  BlogAuthorWrapper,
  BlogMetaContainer,
  Divider,
} from './BlogArticle.style';

import { useState } from 'react';
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
  id?: number;
}

export const BlogArticle = ({
  title,
  subtitle,
  content,
  author,
  tags,
  id,
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
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };
  return (
    <>
      <BlogArticleContainer>
        <BlogArticleTopHeader>
          {!!tags?.data[0]?.attributes.Title ? (
            <Tag
              color={tags.data[0]?.attributes.TextColor}
              backgroundColor={tags.data[0]?.attributes.BackgroundColor}
              component="span"
              variant="lifiBodyMediumStrong"
              key={`blog-article-tag-${tags.data[0]?.id}`}
            >
              {tags.data[0].attributes?.Title}
            </Tag>
          ) : (
            <BlogArticleHeaderTagSkeleton variant="rectangular" />
          )}
          {!!createdAt ? (
            <BlogArticleHeaderMeta>
              <BlogArticleHeaderMetaDate variant="lifiBodyXSmall" as="span">
                {formatDate(publishedAt || createdAt)}
              </BlogArticleHeaderMetaDate>
              <span>{t('blog.minRead', { minRead: minRead })}</span>
            </BlogArticleHeaderMeta>
          ) : (
            <BlogArticleMetaSkeleton variant="text" />
          )}
        </BlogArticleTopHeader>
        {title ? (
          <BlogArticleTitle as="h1">{title}</BlogArticleTitle>
        ) : (
          <BlogArticleTitleSkeleton />
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
              <BlogArticlAuthorName
                variant="lifiBodyXSmallStrong"
                component="span"
              >
                {author.data?.attributes.Name}
              </BlogArticlAuthorName>
            ) : (
              <BlogArticlAuthorNameSkeleton variant="text" />
            )}
          </BlogAuthorContainer>
          <ShareArticleIcons title={title} slug={slug} />
        </BlogMetaContainer>
      </BlogArticleContainer>

      <BlogArticleImageContainer>
        {image?.data && (
          <BlogArticleImage
            onLoad={handleImageLoaded}
            src={`${baseUrl}${image.data.attributes?.url}`}
            alt={image?.data.attributes?.alternativeText}
          />
        )}
        {!isLoaded && !image?.data && <BlogArticleImageSkeleton />}
      </BlogArticleImageContainer>
      <BlogArticleContainer>
        <BlogArticleContentContainer>
          {subtitle ? (
            <BlogArticleSubtitle variant="lifiHeaderMedium" as="h4">
              {subtitle}
            </BlogArticleSubtitle>
          ) : (
            <BlogArticleSubtitleSkeleton variant="text" />
          )}
          {content ? (
            <CustomRichBlocks id={id} baseUrl={baseUrl} content={content} />
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
