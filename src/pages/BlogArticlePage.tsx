import type { Breakpoint } from '@mui/material';
import { Container, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'src/Layout';
import {
  BlogArticle,
  BlogSlideshow,
  JoinDiscordBanner,
  Tag,
} from 'src/components';
import { useStrapi } from 'src/hooks';
import type { BlogArticleData, TagAttributes } from 'src/types';

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
    queryKey: ['blog-article', `${id ?? ''}`],
  });
  const { data: articles, isSuccess: articlesIsSuccess } =
    useStrapi<BlogArticleData>({
      contentType: 'blog-articles',
      queryKey: ['blog-articles'],
    });

  const isSuccess = articleIsSuccess && articlesIsSuccess;

  const filteredArticles = useMemo(() => {
    return article && articles?.filter((el) => el.id !== article[0].id);
  }, [article, articles]);

  return (
    <>
      <Layout hideNavbarTabs={true}>
        <Container
          sx={{
            padding: theme.spacing(1.5, 0, 3),
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
            },
            [theme.breakpoints.up('xl' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `${theme.breakpoints.values.lg}px`,
            },
          }}
        >
          <BlogArticle
            subtitle={isSuccess ? article[0].attributes?.Subtitle : undefined}
            title={isSuccess ? article[0].attributes.Title : undefined}
            content={isSuccess ? article[0].attributes.Content : undefined}
            slug={isSuccess ? article[0].attributes.Slug : undefined}
            author={!!article ? article[0].attributes.author : undefined}
            publishedAt={
              isSuccess ? article[0].attributes.publishedAt : undefined
            }
            createdAt={isSuccess ? article[0].attributes.createdAt : undefined}
            updatedAt={isSuccess ? article[0].attributes.updatedAt : undefined}
            tags={isSuccess ? article[0].attributes.tags : undefined}
            image={isSuccess ? article[0].attributes.Image : undefined}
            baseUrl={articleUrl.origin ?? undefined}
          />
        </Container>

        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1.5, 2, 3),
            flexWrap: 'wrap',
            gap: theme.spacing(1),
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 3, 3),
              maxWidth: `100% !important`,
            },
            [theme.breakpoints.up('md' as Breakpoint)]: {
              padding: theme.spacing(1.5, 0, 3),
              maxWidth: `${theme.breakpoints.values.md}px !important`,
            },
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              padding: theme.spacing(1.5, 0, 3),
              maxWidth: `${theme.breakpoints.values.lg}px !important`,
            },
            [theme.breakpoints.up('xl' as Breakpoint)]: {
              maxWidth: `${theme.breakpoints.values.lg}px !important`,
            },
          }}
        >
          {isSuccess
            ? article[0].attributes.tags?.data.length > 0 &&
              article[0].attributes.tags.data.map(
                (tag: TagAttributes, index: any) => (
                  <Tag
                    color={tag.attributes.TextColor}
                    backgroundColor={tag.attributes.BackgroundColor}
                    component="span"
                    variant="lifiBodySmall"
                    key={`blog-article-${index}`}
                  >{`${tag.attributes.Title}`}</Tag>
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

      <BlogSlideshow
        showAllButton={true}
        data={filteredArticles}
        url={articleUrl}
      />
    </>
  );
};
