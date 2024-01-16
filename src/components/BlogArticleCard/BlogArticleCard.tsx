import type { Breakpoint } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { StrapiImageData, TagData } from 'src/types';
import { formatDate, readingTime } from 'src/utils';
import {
  BlogArticleCard,
  BlogArticleCardImage,
  BlogArticleMeta,
  BlogTagsOverlay,
} from '.';
import { Tag } from '../Tag.style';

interface BlogCardProps {
  title: string;
  subtitle: string;
  content: any;
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
  const navigate = useNavigate();

  const handleclick = () => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <BlogArticleCard onClick={handleclick}>
      <BlogArticleCardImage
        src={`${baseUrl}${image.data.attributes.url}`}
        alt={image.data.attributes.alternativeText}
      />
      <Typography
        variant="lifiHeaderXSmall"
        sx={{ pt: theme.spacing(1), color: theme.palette.black.main }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          justifyContent: 'space-between',
          position: 'relative',
          marginBottom: 1.5,
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            mt: theme.spacing(1.5),
            flexDirection: 'row',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            // pt: 2,
            overflow: 'auto',
            width: '100%',
            position: 'relative',
            scrollSnapType: 'x mandatory',
            '& > *': {
              flexShrink: 0,
              scrollSnapAlign: 'center',
            },
            '::-webkit-scrollbar': { display: 'none' },
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              // width: '75%',
            },
          }}
        >
          {tags?.data.length > 0
            ? tags.data.map((tag, index) => (
                <Tag
                  component="span"
                  variant="lifiBodyXSmallStrong"
                  backgroundColor={tag.attributes.BackgroundColor}
                  color={tag.attributes.TextColor}
                >{`${tag.attributes.Title}`}</Tag>
              ))
            : null}
          <BlogTagsOverlay />
        </Box>
        <BlogArticleMeta>
          <Typography
            variant="lifiBodyXSmall"
            component="span"
            sx={{
              marginLeft: theme.spacing(0),

              [theme.breakpoints.up('sm' as Breakpoint)]: {
                marginLeft: theme.spacing(2.5),
              },
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
      </Box>
    </BlogArticleCard>
  );
};
