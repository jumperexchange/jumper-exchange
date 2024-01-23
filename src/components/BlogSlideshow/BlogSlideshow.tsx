import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BlogArticleCard, Button, SlideshowContainer } from 'src/components';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData } from 'src/types';
import { getContrastAlphaColor } from 'src/utils';

interface BlogSlideshowProps {
  styles?: CSSObject;
  showAllButton?: boolean;
  showIntro?: boolean;
}

export const BlogSlideshow = ({
  styles,
  showAllButton,
  showIntro,
}: BlogSlideshowProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackArrow = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { data: blogArticles, url } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    queryKey: 'blog-articles',
  });
  return blogArticles ? (
    <>
      <Grid
        container
        display="grid"
        textAlign="left"
        justifyContent="center"
        // justifyItems="center"
        gridTemplateColumns="100%"
        m={theme.spacing(4, 0, 0)}
        sx={{
          gap: 2,
          padding: theme.spacing(2, 0, 0),
          [theme.breakpoints.up('md' as Breakpoint)]: {
            gap: 2,
            // justifyItems: 'center',
          },
          [theme.breakpoints.up('lg' as Breakpoint)]: {
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
          },
          [theme.breakpoints.up('lg' as Breakpoint)]: {
            gridTemplateColumns: '512px 512px',
          },
          ...styles,
        }}
      >
        {showIntro ? (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: 1,
              [theme.breakpoints.up('md' as Breakpoint)]: { marginTop: 2 },
              [theme.breakpoints.up('lg' as Breakpoint)]: {
                marginTop: 3,
                marginBottom: 2,
                gridColumn: 'span 2',
                placeSelf: 'flex-start',
              },
            }}
          >
            <Typography
              variant={'lifiHeaderMedium'}
              sx={{
                // textShadow:
                //   '2px 2px 4px rgba(0, 0, 0, 0.25), -2px -2px 4px rgba(0, 0, 0, 0.25)',
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  fontSize: '48px',
                  fontWeight: 700,
                  lineHeight: '56px',
                },
              }}
            >
              {t('blog.title')}
            </Typography>
            <Typography
              variant={'lifiBodyMediumStrong'}
              sx={{
                maxHeight: '40px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  fontSize: '18px',
                  maxHeight: '48px',
                  lineHeight: '24px',
                },
              }}
            >
              {t('blog.subtitle')}
            </Typography>
          </Grid>
        ) : null}
        <SlideshowContainer styles={styles}>
          {blogArticles?.map((article: BlogArticleData, index: number) => {
            return (
              <BlogArticleCard
                image={article.attributes.Image}
                slug={article.attributes.Slug}
                title={article.attributes.Title}
                baseUrl={url}
              />
            );
          })}
        </SlideshowContainer>
        {showAllButton ? (
          <Box width="100%" display="flex" justifyContent="center">
            <Button
              variant="secondary"
              onClick={handleBackArrow}
              styles={{
                width: '320px',
                margin: theme.spacing(0, 'auto', 4),
                backgroundColor: getContrastAlphaColor(theme, '4%'),
                '&:hover': {
                  backgroundColor: getContrastAlphaColor(theme, '12%'),
                },
              }}
            >
              {t('blog.seeAllPosts')}
            </Button>
          </Box>
        ) : null}
      </Grid>
    </>
  ) : null;
};
