import type { StrapiResponse, TagAttributes } from '@/types/strapi';
import { TagStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

const predefinedOrder = ['Announcement', 'Partner', 'Bridge'];

// Helper function to sort tags based on predefined order
const sortTagsByPredefinedOrder = (tags: TagAttributes[]) => {
  return tags.sort((a, b) => {
    const titleA = a?.Title;
    const titleB = b?.Title;

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
    tag.blog_articles = tag.blog_articles.sort((a, b) => {
      const dateA = a?.publishedAt ? Date.parse(a?.publishedAt) : -Infinity; // Default to oldest if undefined
      const dateB = b?.publishedAt ? Date.parse(b?.publishedAt) : -Infinity; // Default to oldest if undefined

      return dateB - dateA;
    });
    return tag;
  });
};

export async function getTags(): Promise<StrapiResponse<TagAttributes>> {
  const urlParams = new TagStrapiApi().addPaginationParams({
    page: 1,
    pageSize: 20,
    withCount: false,
  });
  const apiUrl = urlParams.getApiUrl();
  const accessToken = getStrapiApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60 * 5, // revalidate every 5 minutes
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
  return { ...data };
}
