import { Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Layout } from 'src/Layout';
import { useStrapiQuery } from 'src/hooks';

export const BlogArticlePage = () => {
  const { id } = useParams();
  console.log('PARAM', id);
  const { data: blogArticle } = useStrapiQuery({
    contentType: 'blog-articles',
    filterSlug: id,
  });

  console.log('ARTICLE', blogArticle);
  return blogArticle?.length ? (
    <Layout hideNavbarTabs={true}>
      <Link to={'/blog'}>
        <Button>Back to Blog</Button>
      </Link>
      <div>BlogArticlePage</div>
      <p>{blogArticle[0]?.attributes.Title}</p>
      <div>{blogArticle[0]?.attributes.Content}</div>
    </Layout>
  ) : null;
};
