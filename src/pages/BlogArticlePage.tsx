import type { Breakpoint } from '@mui/material';
import { Box, Container, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from 'src/Layout';
import {
  BlogArticle,
  BlogArticleCard,
  Button,
  JoinDiscordBanner,
  SlideshowContainer,
  Tag,
} from 'src/components';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData, TagAttributes } from 'src/types';

export const BlogArticlePage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
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

  console.log('article', article);
  // Ensure that articles and article are defined before using them
  return (
    <>
      <Layout hideNavbarTabs={true}>
        <Container
          sx={{
            padding: theme.spacing(1.5, 0, 3),
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.md}px`,
            },
          }}
        >
          <BlogArticle
            subtitle={
              articles && article ? article[0].attributes?.Subtitle : undefined
            }
            title={
              articles && article ? article[0].attributes.Title : undefined
            }
            content={
              articles && article ? article[0].attributes.Content : undefined
            }
            slug={articles && article ? article[0].attributes.Slug : undefined}
            author={!!article ? article[0].attributes.author : undefined}
            publishedAt={
              articles && article
                ? article[0].attributes.publishedAt
                : undefined
            }
            createdAt={
              articles && article ? article[0].attributes.createdAt : undefined
            }
            updatedAt={
              articles && article ? article[0].attributes.updatedAt : undefined
            }
            tags={articles && article ? article[0].attributes.tags : undefined}
            image={
              articles && article ? article[0].attributes.Image : undefined
            }
            baseUrl={articleUrl.origin ?? undefined}
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
          {articles && article
            ? article[0].attributes.tags?.data.length > 0 &&
              article[0].attributes.tags.data.map(
                (tag: TagAttributes, index: any) => (
                  <Tag
                    color={tag.attributes.TextColor}
                    backgroundColor={tag.attributes.BackgroundColor}
                    component="span"
                    variant="lifiBodySmall"
                    key={`blog-article-${index}`}
                  >{`${tag.attributes.Title}`}</Tag> //catId={tag.id}
                ),
              )
            : null}
        </Container>

        {/* <Container
          sx={{
            padding: theme.spacing(1.5, 0, 3),
            [theme.breakpoints.up('sk' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.md}px`,
            },
          }}
        >
          <AccordionFAQ content={article[0].attributes.faq_items.data} />
        </Container> */}
      </Layout>
      <JoinDiscordBanner />
      <Box
        sx={{
          backgroundColor: theme.palette.white.main,
          padding: theme.spacing(6, 1, 8),
        }}
      >
        <SlideshowContainer>
          {filteredArticles?.map((el) => (
            <BlogArticleCard
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
  );
};
