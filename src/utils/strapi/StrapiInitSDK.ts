import Strapi from 'strapi-sdk-js';

const apiAccesToken =
  process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
    ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
    : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

export const strapi = new Strapi({
  url:
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : process.env.NEXT_PUBLIC_STRAPI_URL,
  prefix: '/api',
  store: {
    key: 'strapi_jwt',
    useLocalStorage: false,
    cookieOptions: { path: '/' },
  },
  axiosOptions: {
    headers: {
      Authorization: `Bearer ${apiAccesToken}`,
    },
  },
});
