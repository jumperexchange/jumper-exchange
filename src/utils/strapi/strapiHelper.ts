export function getStrapiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}`;
  return apiBaseUrl;
}

export function getStrapiApiAccessToken() {
  const apiAccessToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  return apiAccessToken;
}
