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

import { ArticleJsonSchema } from '@/components/JsonSchema/JsonSchemaArticle';
import { Tag } from '@/components/Tag.style';
import type { BlogArticleData } from '@/types/strapi';
import type { ThemeMode } from '@/types/theme';
import { readingTime } from '@/utils/readingTime';
import { CustomRichBlocks, ShareArticleIcons } from '..';
import { BlogAuthorSocials } from '../BlogAuthorSocials/BlogAuthorSocials';

interface BlogArticleProps {
  article: BlogArticleData;
  baseUrl?: string;
  activeThemeMode?: ThemeMode;
  id?: number;
}

export const BlogArticle = ({
  article,
  baseUrl,
  activeThemeMode,
}: BlogArticleProps) => {
  const theme = useTheme();
  const {
    Subtitle: subtitle,
    Title: title,
    Content: content,
    Slug: slug,
    author,
    publishedAt,
    createdAt,
    updatedAt,
    tags,
    Image: image,
  } = article;
  const id = article.id;
  const minRead = readingTime(content);
  const { t } = useTranslation();

  const mainTag = tags[0];

  return (
    <>
      <BlogArticleContainer>
        <BlogArticleContentContainer sx={{ marginTop: 0 }}>
          <BlogArticleTopHeader>
            {tags?.[0]?.Title ? (
              <Tag
                sx={{
                  ...(mainTag?.TextColor && {
                    color: mainTag.TextColor,
                  }),
                }}
                backgroundColor={mainTag?.BackgroundColor}
                component="span"
                variant="bodyMediumStrong"
                key={`blog-article-tag-${mainTag?.id}`}
              >
                {mainTag?.Title}
              </Tag>
            ) : (
              <BlogArticleHeaderTagSkeleton variant="rectangular" />
            )}
            {createdAt ? (
              <BlogArticleHeaderMeta>
                <BlogArticleHeaderMetaDate variant="bodyXSmall" as="span">
                  {t('format.shortDate', {
                    value: new Date(publishedAt || createdAt),
                  })}
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
            <BlogArticleSubtitle variant="headerMedium" as="h2">
              {subtitle}
            </BlogArticleSubtitle>
          ) : (
            <BlogArticleSubtitleSkeleton variant="text" />
          )}

          <BlogMetaContainer>
            {/*// The following block is a duplication of the row 196 onwards but with slightly different styles, needs to be revisited*/}
            <BlogAuthorContainer>
              {author?.Avatar?.url ? (
                <BlogAuthorAvatar
                  width={64}
                  height={64}
                  src={`${baseUrl}${author?.Avatar?.url}`}
                  alt={`${author?.Name}'s avatar`}
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
                {author ? (
                  <BlogArticlAuthorName
                    variant="bodyXSmallStrong"
                    component="span"
                  >
                    {author?.Name}
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
        {image ? (
          <BlogArticleImage
            src={`${baseUrl}${image.url}`}
            alt={image?.alternativeText ?? title}
            priority
            width={1200}
            height={640}
          />
        ) : (
          <BlogArticleImageSkeleton />
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
            {author?.Avatar?.url ? (
              <BlogAuthorAvatar
                width={64}
                height={64}
                src={`${baseUrl}${author?.Avatar?.url}`}
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
              {author ? (
                <BlogArticlAuthorName component="span">
                  {author.Name}
                </BlogArticlAuthorName>
              ) : (
                <BlogArticlAuthorNameSkeleton variant="text" />
              )}
              {author ? (
                <BlogArticlAuthorRole variant="bodyXSmall" component="span">
                  {author?.Role}
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
      {image && publishedAt && author && title && createdAt ? (
        <ArticleJsonSchema
          title={title}
          images={[`${baseUrl}${image?.url}`]}
          datePublished={publishedAt || createdAt}
          dateModified={updatedAt || createdAt}
          authorName={author?.Name}
        />
      ) : null}
    </>
  );
};
