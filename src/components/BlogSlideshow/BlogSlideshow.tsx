import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BlogArticleCard, Button, SlideshowContainer } from 'src/components';
import type { BlogArticleData } from 'src/types';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';

interface BlogSlideshowProps {
  showAllButton?: boolean;
  url: URL;
  data: BlogArticleData[];
}

export const BlogSlideshow = ({
  data,
  url,
  showAllButton,
}: BlogSlideshowProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleShowAll = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return data ? (
    <Box
      sx={{
        backgroundColor: theme.palette.white.main,
        padding: theme.spacing(8, 1, 4),
      }}
    >
      <SlideshowContainer styles={{ height: 308 }}>
        {data ? (
          data?.map((article, index) => {
            return (
              <BlogArticleCard
                styles={{
                  color: theme.palette.grey[800],
                }}
                baseUrl={url}
                key={`blog-page-article-${index}`}
                image={article.attributes.Image}
                title={article.attributes.Title}
                slug={article.attributes.Slug}
              />
            );
          })
        ) : (
          <>
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
          </>
        )}
      </SlideshowContainer>
      {showAllButton ? (
        <Box width="100%" display="flex" justifyContent="center" marginTop={4}>
          <Button
            variant="primary"
            onClick={handleShowAll}
            styles={{
              width: '320px',
              margin: theme.spacing(0, 'auto', 4),
            }}
          >
            {t('blog.seeAllPosts')}
          </Button>
        </Box>
      ) : null}
    </Box>
  ) : null;
};
