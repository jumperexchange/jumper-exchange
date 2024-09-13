import type {
  BlogArticleData,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import { TagStrapiApi } from '@/utils/strapi/StrapiApi';

export interface GetTagsResponse extends StrapiResponse<TagAttributes> {
  url: string; // Define the shape of the URL
}

export async function getTags(): Promise<GetTagsResponse> {
  const urlParams = new TagStrapiApi()
    .sort('desc')
    .addPaginationParams({ page: 1, pageSize: 20, withCount: false });
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    cache: 'force-cache',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json().then((output) => {
    const filteredData = output.data.filter((item: TagAttributes) => {
      return item.attributes.blog_articles.data.length > 0;
    });

    return {
      meta: output.meta,
      data: filteredData?.sort(
        // sort by blog_articles' publishedAt date
        (
          {
            attributes: {
              blog_articles: { data: dataA },
            },
          }: { attributes: { blog_articles: { data: BlogArticleData[] } } },
          {
            attributes: {
              blog_articles: { data: dataB },
            },
          }: { attributes: { blog_articles: { data: BlogArticleData[] } } },
        ) => {
          const latestArticleA = dataA.sort(
            (a, b) =>
              Date.parse(b.attributes.publishedAt!) -
              Date.parse(a.attributes.publishedAt!),
          )[0];
          const latestArticleB = dataB.sort(
            (a, b) =>
              Date.parse(b.attributes.publishedAt!) -
              Date.parse(a.attributes.publishedAt!),
          )[0];

          return (
            Date.parse(latestArticleB.attributes.publishedAt!) -
            Date.parse(latestArticleA.attributes.publishedAt!)
          );
        },
      ),
    };
  });

  return { ...data, url: apiBaseUrl };
}
