// app/sitemap.js

import { JUMPER_URL, pages } from '@/const/urls';
import { getArticles } from './lib/getArticles';

export default async function sitemap() {
  const articles = await getArticles().then((article) =>
    article.data.map((el) => {
      console.log('SITEMAP:', el);
      return {
        url: `${JUMPER_URL}/${el.attributes.Slug}`,
        lastModified: el.attributes.updatedAt || el.attributes.publishedAt,
      };
    }),
  );

  const routes = pages.map((route) => ({
    url: `${JUMPER_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...articles];
}
