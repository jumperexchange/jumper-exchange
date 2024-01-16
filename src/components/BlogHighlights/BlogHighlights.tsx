import type { Breakpoint, CSSObject } from '@mui/material';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData } from 'src/types';
import { getContrastAlphaColor } from 'src/utils';
import { BlogCard } from '../BlogArticleCard';

interface BlogHighlightsProps {
  styles?: CSSObject;
  showAllButton?: boolean;
  showIntro?: boolean;
}

export const BlogHighlights = ({
  styles,
  showAllButton,
  showIntro,
}: BlogHighlightsProps) => {
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
  return (
    <>
      <Grid
        container
        display="grid"
        textAlign="left"
        justifyContent="center"
        // justifyItems="center"
        gridTemplateColumns="100%"
        m={theme.spacing(4, 0)}
        sx={{
          gap: 2,
          padding: theme.spacing(2),
          [theme.breakpoints.up('md' as Breakpoint)]: {
            gap: 2,
            justifyItems: 'center',
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
              Dive into
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
              Learn more about bridging and get started
            </Typography>
          </Grid>
        ) : null}

        {blogArticles?.map((article: BlogArticleData) => {
          return (
            <Grid
              item
              xs={12}
              md={6}
              maxWidth={512}
              sx={{
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  padding: 0,
                },
                [theme.breakpoints.up('md' as Breakpoint)]: {
                  width: 512,
                  minWidth: 512,
                },
              }}
            >
              <BlogCard
                title={article.attributes.Title}
                subtitle={article.attributes.Subtitle}
                content={article.attributes.Content}
                tags={article.attributes.tags}
                slug={article.attributes.Slug}
                publishedAt={article.attributes.publishedAt}
                createdAt={article.attributes.createdAt}
                image={article.attributes.Image}
                baseUrl={url.origin}
              />
            </Grid>
          );
        })}
      </Grid>
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
    </>
  );
};
