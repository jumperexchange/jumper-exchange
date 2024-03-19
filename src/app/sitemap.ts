// app/sitemap.js

const URL = 'https://claritydev.net';

export default async function sitemap() {
  const posts = getSortedPostsData.map(({ id, date }) => ({
    url: `${URL}/blog/${id}`,
    lastModified: date,
  }));

  const routes = ['', '/portfolio', '/blog'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...posts];
}
