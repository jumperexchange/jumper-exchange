import type { CSSObject } from '@mui/material';
import { CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { StrapiImageData } from 'src/types';
import { BlogArticleCardContainer, BlogArticleCardImage } from '.';

interface BlogArticleCardProps {
  baseUrl: URL;
  image: StrapiImageData;
  title: string;
  slug: string;
  styles?: CSSObject;
}

export const BlogArticleCard = ({
  baseUrl,
  image,
  title,
  styles,
  slug,
}: BlogArticleCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <BlogArticleCardContainer
      variant="outlined"
      onClick={handleClick}
      sx={styles}
    >
      <BlogArticleCardImage
        src={`${baseUrl?.origin}${image.data.attributes.url}`}
        alt={image.data.attributes.alternativeText}
        draggable={false}
      />
      <CardContent>
        <Typography variant="lifiBodyLarge" sx={{ color: 'inherit' }}>
          {title}
        </Typography>
      </CardContent>
    </BlogArticleCardContainer>
  );
};
