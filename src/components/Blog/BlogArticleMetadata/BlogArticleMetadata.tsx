import type { BlogArticleData } from '@/types/strapi';
import { readingTime } from '@/utils/readingTime';
import { differenceInDays } from 'date-fns';
import type { FC } from 'react';
import { BlogArticleMetaProperty } from './BlogArticleMetadata.style';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import type { TypographyProps } from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';

interface BlogArticleMetadataProps {
  article: BlogArticleData;
  tagSize?: BadgeSize;
  tagVariant?: BadgeVariant;
  metaVariant?: TypographyProps['variant'];
  sx?: SxProps<Theme>;
}

export const BlogArticleMetadata: FC<BlogArticleMetadataProps> = ({
  article,
  tagSize = BadgeSize.MD,
  tagVariant = BadgeVariant.Alpha,
  metaVariant = 'bodyXSmall',
  sx = {
    flexDirection: 'column',
    gap: 1,
  },
}) => {
  const { t } = useTranslation();
  const firstTag = article?.tags?.[0];
  const now = Date.now();
  const publishDate = article.publishedAt || article.createdAt || now;
  const updateDate = article.updatedAt || publishDate;
  const isUpdateAfterPublish =
    Boolean(article.updatedAt) && differenceInDays(updateDate, publishDate) > 0;
  const minRead = readingTime(article?.WordCount);

  return (
    <Stack useFlexGap sx={sx}>
      <Stack
        useFlexGap
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 0.5,
        }}
      >
        {!!publishDate && (
          <BlogArticleMetaProperty
            variant={metaVariant}
            component="span"
            color="textSecondary"
          >
            {t('format.shortDate', {
              value: new Date(publishDate),
            })}
          </BlogArticleMetaProperty>
        )}

        {isUpdateAfterPublish && (
          <BlogArticleMetaProperty
            variant={metaVariant}
            component="span"
            color="textSecondary"
          >
            {t('blog.updated', {
              date: t('format.shortDate', {
                value: new Date(updateDate),
              }),
            })}
          </BlogArticleMetaProperty>
        )}
        <BlogArticleMetaProperty
          variant={metaVariant}
          component="span"
          color="textSecondary"
        >
          {t('blog.minRead', { minRead: `${minRead}` })}
        </BlogArticleMetaProperty>
      </Stack>

      {firstTag && (
        <Badge label={firstTag.Title} size={tagSize} variant={tagVariant} />
      )}
    </Stack>
  );
};
