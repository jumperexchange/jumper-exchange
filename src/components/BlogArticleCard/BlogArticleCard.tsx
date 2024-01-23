import type { Breakpoint } from '@mui/material';
import {
  Card,
  CardContent,
  Typography,
  lighten,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StrapiImageData } from 'src/types';
import { BlogArticleCardImage } from './BlogArticleCard.style';

interface BlogArticleCardProps {
  baseUrl: URL;
  image: StrapiImageData;
  title: string;
  slug: string;
}

export const BlogArticleCard = ({
  baseUrl,
  image,
  title,
  slug,
}: BlogArticleCardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <Card
      variant="outlined"
      onClick={handleClick}
      sx={{
        flexShrink: 0,
        // width: '100%',
        width: '100%',
        border: 'unset',
        p: 1,
        borderRadius: '24px',
        background: 'transparent',
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          width: 420,
        },
        '&:hover': {
          cursor: 'pointer',
          background: lighten(theme.palette.grey[200], 0.5),
        },
      }}
    >
      <BlogArticleCardImage
        // sx={{ width: '100%', height: '100%' }}
        src={`${baseUrl?.origin}${image.data.attributes.url}`}
        alt={image.data.attributes.alternativeText}
        draggable={false}
      />
      <CardContent
        sx={{
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.black.main,
          }),
        }}
      >
        <Typography variant="lifiBodyLarge" sx={{ color: 'inherit' }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};
