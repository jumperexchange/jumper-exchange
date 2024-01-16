import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { Breakpoint } from '@mui/material';
import {
  Box,
  Container,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from 'src/Layout';
import {
  AccordionFAQ,
  BlogArticle,
  BlogPreviewCard,
  Button,
  JoinDiscordBanner,
  SlideshowContainer,
} from 'src/components';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData, TagAttributes } from 'src/types';

const slideDistance = 550;

export const BlogArticlePage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const slideshowContainerRef = useRef<HTMLDivElement>(null);
  const { data: article, url: articleUrl } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    filterSlug: id,
    queryKey: ['blog-article', `${id ?? ''}`],
  });
  const { data: articles } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    queryKey: ['blog-articles'],
  });

  // setCurrentArticleId(article[0].id);

  const filteredArticles = useMemo(() => {
    return article && articles?.filter((el) => el.id !== article[0].id);
  }, [article, articles]);

  const navigate = useNavigate();

  const handleBackArrow = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = useCallback(
    (direction: 'forward' | 'back') => {
      if (slideshowContainerRef.current) {
        const node: HTMLDivElement = slideshowContainerRef.current;
        const scrollLeftPos = node.scrollLeft;
        const scrollWidth =
          slideshowContainerRef.current.scrollWidth -
          slideshowContainerRef.current.clientWidth;

        let scrollPos = 0;
        switch (direction) {
          case 'forward':
            if (scrollLeftPos + slideDistance < scrollWidth) {
              scrollPos = scrollLeftPos + slideDistance;
            } else {
              scrollPos = scrollWidth;
            }
            break;
          case 'back':
            if (scrollLeftPos - slideDistance > 0) {
              scrollPos = scrollLeftPos - slideDistance;
            } else {
              scrollPos = 0;
            }
            break;
        }

        node.scrollTo({
          left: parseInt(`${scrollPos}`),
          behavior: 'smooth',
        });
      } else {
      }
    },
    [slideshowContainerRef],
  );

  // Ensure that articles and article are defined before using them

  return articles && article ? (
    <>
      <Layout hideNavbarTabs={true}>
        <Container
          sx={{
            padding: theme.spacing(1.5, 0, 3),
            [theme.breakpoints.up('sk' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.md}px`,
            },
          }}
        >
          <BlogArticle
            subtitle={article[0].attributes.Subtitle}
            title={article[0].attributes.Title}
            content={article[0].attributes.Content}
            slug={article[0].attributes.Slug}
            author={article[0].attributes.author}
            publishedAt={article[0].attributes.publishedAt}
            createdAt={article[0].attributes.createdAt}
            updatedAt={article[0].attributes.updatedAt}
            tags={article[0].attributes.tags}
            image={article[0].attributes.Image}
            baseUrl={articleUrl.origin}
          />
        </Container>

        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'space-between',
            padding: theme.spacing(1.5, 2, 3),
            flexWrap: 'wrap',
            gap: theme.spacing(1),
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.md}px !important`,
            },
            [theme.breakpoints.up('md' as Breakpoint)]: {
              padding: theme.spacing(1.5, 0, 3),
              maxWidth: `${theme.breakpoints.values.md}px !important`,
            },
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              maxWidth: `${theme.breakpoints.values.md}px !important`,
            },
          }}
        >
          {article[0].attributes.tags?.data.length > 0 &&
            article[0].attributes.tags.data.map(
              (tag: TagAttributes, index: any) => (
                <Typography
                  component="span"
                  variant="lifiBodySmall"
                  key={`blog-article-${index}`}
                  sx={{
                    height: '40px',
                    fontSize: '14px',
                    lineHeight: '24px',
                    padding: theme.spacing(1, 2),
                    backgroundColor: tag.attributes.BackgroundColor
                      ? tag.attributes.BackgroundColor
                      : theme.palette.mode === 'light'
                        ? theme.palette.secondary.main
                        : theme.palette.accent1Alt.main,
                    color: tag.attributes.TextColor
                      ? tag.attributes.TextColor
                      : theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.white.main,
                    userSelect: 'none',
                    borderRadius: '24px',
                    flexShrink: 0,
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
                        : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
                    ':not(:first-of-type)': {
                      ml: theme.spacing(0.5),
                    },
                    '&:before': {
                      content: '"#"',
                      mr: theme.spacing(0.5),
                    },
                  }}
                >{`${tag.attributes.Title}`}</Typography> //catId={tag.id}
              ),
            )}
        </Container>

        <Container
          sx={{
            padding: theme.spacing(1.5, 0, 3),
            [theme.breakpoints.up('sk' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.md}px`,
            },
          }}
        >
          <AccordionFAQ content={article[0].attributes.faq_items.data} />
        </Container>
      </Layout>
      <JoinDiscordBanner />
      <Box
        sx={{
          backgroundColor: theme.palette.white.main,
          padding: theme.spacing(6, 1, 8),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              justifyContent: 'flex-start',
            },
          }}
        >
          <Typography
            variant="lifiHeaderMedium"
            sx={{
              marginLeft: 2,
              ...(theme.palette.mode === 'dark' && {
                color: theme.palette.black.main,
              }),
            }}
          >
            {t('blog.similarPosts')}
          </Typography>
          <Box
            sx={{
              [theme.breakpoints.up('md' as Breakpoint)]: {
                ...(filteredArticles.length < 3 && { display: 'none' }),
                marginLeft: 3,
              },
            }}
          >
            <IconButton onClick={() => handleChange('back')}>
              <ArrowBackIosIcon />
            </IconButton>

            <IconButton
              onClick={() => handleChange('forward')}
              sx={{ marginLeft: 1 }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>

        <SlideshowContainer
          ref={slideshowContainerRef}
          styles={{ paddingTop: theme.spacing(2) }}
        >
          {filteredArticles.map((el) => (
            <BlogPreviewCard
              image={el.attributes.Image}
              slug={el.attributes.Slug}
              title={el.attributes.Title}
              baseUrl={articleUrl}
            />
          ))}
        </SlideshowContainer>
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            variant="primary"
            onClick={handleBackArrow}
            styles={{
              width: '320px',
              margin: 'auto',
              // ...(theme.palette.mode === 'dark' && {
              //   color: theme.palette.black.main,
              // }),
              marginTop: theme.spacing(2),
              // backgroundColor: getContrastAlphaColor(theme, '4%'),
              // '&:hover': {
              //   backgroundColor: getContrastAlphaColor(theme, '12%'),
              // },
            }}
          >
            {t('blog.seeAllPosts')}
          </Button>
        </Box>
      </Box>
    </>
  ) : (
    <Skeleton variant="rectangular" width={210} height={118} />
    // <Box textAlign={'center'} mt={theme.spacing(1)}>
    //   <CircularProgress />
    // </Box>
  );
};
