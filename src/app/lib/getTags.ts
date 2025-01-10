import type { StrapiResponse, TagAttributes } from '@/types/strapi';
import { TagStrapiApi } from '@/utils/strapi/StrapiApi';

export interface GetTagsResponse extends StrapiResponse<TagAttributes> {
  url: string;
}

const predefinedOrder = ['Announcement', 'Partner', 'Bridge'];

// Helper function to sort tags based on predefined order
const sortTagsByPredefinedOrder = (tags: TagAttributes[]) => {
  return tags.sort((a, b) => {
    const titleA = a.attributes?.Title;
    const titleB = b.attributes?.Title;

    const indexA = predefinedOrder.indexOf(titleA);
    const indexB = predefinedOrder.indexOf(titleB);

    if (indexA === -1 && indexB === -1) {
      return 0;
    }
    if (indexA === -1) {
      return 1;
    }
    if (indexB === -1) {
      return -1;
    }
    return indexA - indexB;
  });
};

// Helper function to sort blog articles by `publishedAt` date
const sortBlogArticlesByPublishedDate = (tags: TagAttributes[]) => {
  return tags.map((tag) => {
    tag.attributes?.blog_articles.data =
      tag.attributes?.blog_articles.data.sort((a, b) => {
        const dateA = a.attributes?.publishedAt
          ? Date.parse(a.attributes?.publishedAt)
          : -Infinity; // Default to oldest if undefined
        const dateB = b.attributes?.publishedAt
          ? Date.parse(b.attributes?.publishedAt)
          : -Infinity; // Default to oldest if undefined

        return dateB - dateA;
      });
    return tag;
  });
};

export async function getTags(): Promise<GetTagsResponse> {
  const urlParams = new TagStrapiApi().addPaginationParams({
    page: 1,
    pageSize: 20,
    withCount: false,
  });
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
    let filteredData = output.data;

    // Sort blog_articles by published date first
    filteredData = sortBlogArticlesByPublishedDate(filteredData);

    // Then sort tags by predefined order
    filteredData = sortTagsByPredefinedOrder(filteredData);

    return {
      meta: output.meta,
      data: filteredData,
    };
  });

  return { ...data, url: apiBaseUrl };
}
