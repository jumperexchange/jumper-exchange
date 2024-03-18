interface GetStrapiBaseUrlProps {
  contentType:
    | 'feature-cards'
    | 'blog-articles'
    | 'faq-items'
    | 'tags'
    | 'jumper-users';
}

export const getStrapiBaseUrl = ({ contentType }: GetStrapiBaseUrlProps) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : process.env.NEXT_PUBLIC_STRAPI_URL;

  const apiUrl = new URL(`${baseUrl}/${contentType}`);

  // show drafts ONLY on development env
  if (process.env.MODE === 'development') {
    return apiUrl.searchParams.set('publicationState', 'preview');
  } else {
    return apiUrl;
  }
};
