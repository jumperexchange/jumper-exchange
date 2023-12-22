import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { StrapiImageData, TagData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import { BlogArticleCard, BlogArticleImage, BlogArticleMeta } from '.';

interface BlogCardProps {
  title: string;
  subtitle: string;
  content: string;
  tags: TagData;
  slug: string;
  publishedAt: string | null;
  createdAt: string;
  image: StrapiImageData;
  baseUrl: string;
}

export const BlogCard = ({
  title,
  subtitle,
  content,
  tags,
  publishedAt,
  createdAt,
  slug,
  image,
  baseUrl,
}: BlogCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const minRead = readingTime(content);

  return (
    <Link to={`/blog/${slug}`}>
      <BlogArticleCard>
        <BlogArticleImage
          src={`${baseUrl}${image.data.attributes.url}`}
          alt={image.data.attributes.alternativeText}
        />
        <Typography variant="lifiHeaderXSmall" sx={{ pt: theme.spacing(1) }}>
          {title}
        </Typography>
        {/* <Typography
        variant="lifiBodySmall"
        sx={{ pt: theme.spacing(2), lineHeight: '24px' }}
      >
        {subtitle}
      </Typography> */}
        <BlogArticleMeta>
          {tags?.data.length > 0 &&
            tags.data.map((tag, index) => (
              <Typography
                component="span"
                variant="lifiMono3"
                sx={{
                  height: '32px',
                  padding: theme.spacing(1, 2),
                  backgroundColor: theme.palette.bg.main,
                  color: theme.palette.primary.main,
                  userSelect: 'none',
                  borderRadius: '24px',
                  ':not(:first-of-type)': {
                    ml: theme.spacing(0.5),
                  },
                  '&:before': {
                    content: '"#"',
                    mr: theme.spacing(0.5),
                    color: theme.palette.accent2.main,
                  },
                }}
              >{`${tag.attributes.Title}`}</Typography> //catId={tag.id}
            ))}
          <Typography
            variant="lifiBodyXSmall"
            component="span"
            sx={{
              marginLeft: theme.spacing(2.5),
              '&:after': {
                content: '"•"',
                margin: '0 4px',
              },
            }}
          >
            {formatDate(publishedAt || createdAt)}
          </Typography>
          <Typography variant="lifiBodyXSmall" component="span">
            {t('blog.minRead', { minRead: minRead })}
          </Typography>
        </BlogArticleMeta>
      </BlogArticleCard>
    </Link>
  );
};
