import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
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

import { ArticleJsonSchema } from '@/components/JsonSchema/JsonSchemaArticle';
import { Tag } from '@/components/Tag.style';
import type { ThemeModesSupported } from '@/types/settings';
import type { AuthorData, StrapiImageData, TagData } from '@/types/strapi';
import { formatDate } from '@/utils/formatDate';
import { readingTime } from '@/utils/readingTime';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { CustomRichBlocks, ShareArticleIcons } from '..';
import { BlogAuthorSocials } from '../BlogAuthorSocials/BlogAuthorSocials';

interface BlogArticleProps {
  title?: string;
  subtitle?: string;
  content?: RootNode[];
  tags?: TagData;
  author?: AuthorData;
  slug: string | undefined;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  image?: StrapiImageData;
  baseUrl?: string;
  activeThemeMode?: ThemeModesSupported;
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
  activeThemeMode,
}: BlogArticleProps) => {
  const theme = useTheme();
  const minRead = readingTime(content);
  const { t } = useTranslation();

  return (
    <>
      <BlogArticleContainer>
        <BlogArticleContentContainer sx={{ marginTop: 0 }}>
          <BlogArticleTopHeader>
            {tags?.data[0]?.attributes.Title ? (
              <Tag
                color={tags.data[0]?.attributes.TextColor}
                backgroundColor={tags.data[0]?.attributes.BackgroundColor}
                component="span"
                variant="bodyMediumStrong"
                key={`blog-article-tag-${tags.data[0]?.id}`}
              >
                {tags.data[0].attributes?.Title}
              </Tag>
            ) : (
              <BlogArticleHeaderTagSkeleton variant="rectangular" />
            )}
            {createdAt ? (
              <BlogArticleHeaderMeta>
                <BlogArticleHeaderMetaDate variant="bodyXSmall" as="span">
                  {formatDate(publishedAt || createdAt)}
                </BlogArticleHeaderMetaDate>
                <span>{t('blog.minRead', { minRead: minRead })}</span>
              </BlogArticleHeaderMeta>
            ) : (
              <BlogArticleMetaSkeleton variant="text" />
            )}
          </BlogArticleTopHeader>

          {title ? (
            <BlogArticleTitle variant="h1">{title}</BlogArticleTitle>
          ) : (
            <BlogArticleTitleSkeleton />
          )}

          {subtitle ? (
            <BlogArticleSubtitle variant="headerMedium" as="h4">
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'center',
                  [theme.breakpoints.down('sm')]: {
                    '&:has(.blog-author-socials)': {
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                    },
                    '.blog-author-socials': {
                      display: 'none',
                    },
                  },
                  [theme.breakpoints.up('sm')]: {
                    alignSelf: 'center',
                  },
                }}
              >
                {author?.data ? (
                  <BlogArticlAuthorName
                    variant="bodyXSmallStrong"
                    component="span"
                  >
                    {author.data?.attributes.Name}
                  </BlogArticlAuthorName>
                ) : (
                  <BlogArticlAuthorNameSkeleton variant="text" />
                )}
                <BlogAuthorSocials
                  author={author}
                  articleId={id}
                  source="blog-article-header"
                />
              </Box>
            </BlogAuthorContainer>
            <ShareArticleIcons title={title} slug={slug} />
          </BlogMetaContainer>
        </BlogArticleContentContainer>
      </BlogArticleContainer>
      <BlogArticleImageContainer>
        {image?.data && (
          <BlogArticleImage
            src={`${baseUrl}${image.data.attributes?.url}`}
            alt={image?.data.attributes?.alternativeText}
          />
        )}
      </BlogArticleImageContainer>
      <BlogArticleContainer>
        <BlogArticleContentContainer>
          {content ? (
            <CustomRichBlocks
              id={id}
              baseUrl={baseUrl}
              content={content}
              activeThemeMode={activeThemeMode}
            />
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
                <BlogArticlAuthorRole variant="bodyXSmall" component="span">
                  {author.data.attributes?.Role}
                </BlogArticlAuthorRole>
              ) : (
                <BlogArticlAuthorRoleSkeleton variant="text" />
              )}
              <BlogAuthorSocials
                author={author}
                articleId={id}
                source="blog-article-footer"
              />
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
