import type { Breakpoint } from '@mui/material';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from 'src/Layout';
import {
  BlogArticle,
  BlogPreviewCard,
  ButtonBackArrow,
  JoinDiscordBanner,
} from 'src/components';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData } from 'src/types';

export const BlogArticlePage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const {
    data: article,
    url: articleUrl,
    isSuccess: articleIsSuccess,
  } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    filterSlug: id,
    queryKey: 'blog-article',
  });
  const {
    data: articles,
    url: articlesUrl,
    isSuccess: articlesIsSuccess,
  } = useStrapi<BlogArticleData>({
    contentType: 'blog-articles',
    queryKey: 'blog-articles',
  });

  const navigate = useNavigate();

  const handleBackArrow = () => {
    navigate('/blog');
  };

  console.log('articleUrl', articleUrl);

  return articleIsSuccess ? (
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
            author={article[0].attributes.author.data}
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
          <ButtonBackArrow
            onClick={handleBackArrow}
            styles={{ marginRight: theme.spacing(2) }}
          />
          {article[0].attributes.tags?.data.length > 0 &&
            article[0].attributes.tags.data.map(
              (tag: { attributes: { Title: any } }, index: any) => (
                <Typography
                  component="span"
                  variant="lifiBodySmall"
                  key={`blog-article-${index}`}
                  sx={{
                    height: '40px',
                    fontSize: '14px',
                    lineHeight: '24px',
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
          {/* <AccordionFAQ content={article[0].attributes.faq_items} /> */}
        </Container>
      </Layout>
      <JoinDiscordBanner />
      {articlesIsSuccess && (
        <Container
          sx={{
            padding: theme.spacing(1.5, 0, 3),
            [theme.breakpoints.up('sk' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.md}px`,
            },
          }}
        >
          import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';

const data = [
  {
    src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
    title: 'Night view',
    description: '4.21M views',
  },
  {
    src: 'https://images.unsplash.com/photo-1527549993586-dff825b37782',
    title: 'Lake view',
    description: '4.74M views',
  },
  {
    src: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36',
    title: 'Mountain view',
    description: '3.98M views',
  },
];

export default function CarouselRatio() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        py: 1,
        overflow: 'auto',
        width: 343,
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
        },
        '::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {data.map((item) => (
                  <Box display={'flex'}>
                  {articles.map((el) => (
                  
                  ))}
                </Box>
        <Card orientation="horizontal" size="sm" key={item.title} variant="outlined">
          <AspectRatio ratio="1" sx={{ minWidth: 60 }}>
          <BlogPreviewCard
                      image={el.attributes.Image}
                      title={el.attributes.Title}
                      baseUrl={articleUrl}
                    />
            <img
              srcSet={`${item.src}?h=120&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.src}?h=120&fit=crop&auto=format`}
              alt={item.title}
            />
          </AspectRatio>
          <Box sx={{ whiteSpace: 'nowrap', mx: 1 }}>
            <Typography level="title-md">{item.title}</Typography>
            <Typography level="body-sm">{item.description}</Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

        </Container>
      )}
    </>
  ) : (
    <Box textAlign={'center'} mt={theme.spacing(1)}>
      <CircularProgress />
    </Box>
  );
};
