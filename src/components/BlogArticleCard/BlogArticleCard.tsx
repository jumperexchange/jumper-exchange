import { CardContent, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StrapiImageData } from 'src/types';
import { BlogArticleCardContainer, BlogArticleCardImage } from '.';

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
    <BlogArticleCardContainer variant="outlined" onClick={handleClick}>
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
    </BlogArticleCardContainer>
  );
};
