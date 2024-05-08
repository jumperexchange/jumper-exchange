import getConfig from 'next/config';
import { resolveRobots } from 'next/dist/build/webpack/loaders/metadata/resolve-route-data';

export async function GET() {
  const { serverRuntimeConfig } = getConfig();
  const isProduction = serverRuntimeConfig.environment === 'production';
  const cacheControl = 'public, max-age=31536000'; // 31536000 seconds is approximately 1 year

  console.log(serverRuntimeConfig, isProduction);

  const headers = new Headers();
  headers.set('Cache-Control', cacheControl);
  headers.set('Content-Type', 'text/plain');

  const robots = resolveRobots({
    rules: {
      userAgent: 'test',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: 'https://jumper.exchange/sitemap.xml',
  });

  return new Response(robots, { headers });
}
