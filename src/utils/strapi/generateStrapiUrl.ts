import type { Account } from '@/hooks/useAccounts';
import {
  STRAPI_BLOG_ARTICLES,
  STRAPI_FEATURE_CARDS,
  STRAPI_JUMPER_USERS,
  STRAPI_PARTNER_THEMES,
  STRAPI_QUESTS,
} from 'src/const/strapiContentKeys';
interface GetStrapiBaseUrlProps {
  contentType:
    | 'feature-cards'
    | 'blog-articles'
    | 'faq-items'
    | 'tags'
    | 'jumper-users'
    | 'partner-themes'
    | 'quests';
}

interface PaginationProps {
  page: number;
  pageSize: number;
  withCount?: boolean;
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true') {
    if (!process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL) {
      console.error('Local Strapi URL is not provided.');
      throw new Error('Local Strapi URL is not provided.');
    }
    return process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL;
  } else {
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.error('Strapi URL is not provided.');
      throw new Error('Strapi URL is not provided.');
    }
    return process.env.NEXT_PUBLIC_STRAPI_URL;
  }
}

export function getStrapiUrl(contentType: string): URL {
  const apiBaseUrl = getBaseUrl();
  return new URL(`${apiBaseUrl}/${contentType}`);
}

const createStrapiApi = ({ contentType }: GetStrapiBaseUrlProps) => {
  const baseUrl = getBaseUrl();
  const apiUrl = getStrapiUrl(contentType);

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    apiUrl.searchParams.set('publicationState', 'preview');
  }

  return {
    baseUrl,
    apiUrl,
    getApiAccessToken() {
      if (process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true') {
        return process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN || '';
      } else {
        return process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';
      }
    },
    sort(order: 'asc' | 'desc') {
      this.apiUrl.searchParams.set('sort', `createdAt:${order.toUpperCase()}`);
      return this;
    },
    addPaginationParams({ page, pageSize, withCount = true }: PaginationProps) {
      this.apiUrl.searchParams.set('pagination[page]', `${page}`);
      this.apiUrl.searchParams.set('pagination[pageSize]', `${pageSize}`);
      this.apiUrl.searchParams.set('pagination[withCount]', `${withCount}`);
      return this;
    },
    getApiUrl() {
      return this.apiUrl.href;
    },
    getApiBaseUrl() {
      return this.apiUrl.origin;
    },
  };
};

const createArticleStrapiApi = () => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_BLOG_ARTICLES });
  strapiApi.apiUrl.searchParams.set('populate[0]', 'Image');
  strapiApi.apiUrl.searchParams.set('populate[1]', 'tags');
  strapiApi.apiUrl.searchParams.set('populate[2]', 'author.Avatar');
  strapiApi.apiUrl.searchParams.set('populate[3]', 'faq_items');

  return {
    ...strapiApi,
    filterByTag(tags: number | number[]) {
      if (typeof tags === 'number') {
        this.apiUrl.searchParams.set('filters[tags][id][$eq]', tags.toString());
      } else if (Array.isArray(tags)) {
        tags.forEach((tag, index) => {
          this.apiUrl.searchParams.set(
            `filters[$and][0][$or][${index}][tags][id][$eq]`,
            `${tag}`,
          );
        });
      }
      return this;
    },
    filterBySlug(filterSlug: string) {
      this.apiUrl.searchParams.set('filters[Slug][$eq]', filterSlug);
      return this;
    },
    filterByFeatured() {
      this.apiUrl.searchParams.set('filters[featured][$eq]', 'true');
      return this;
    },
  };
};

const createQuestStrapiApi = () => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_QUESTS });
  //selected needed field
  strapiApi.apiUrl.searchParams.set('fields[0]', 'Title'); // title
  strapiApi.apiUrl.searchParams.set('fields[1]', 'Points'); // points
  strapiApi.apiUrl.searchParams.set('fields[2]', 'Link'); // link
  strapiApi.apiUrl.searchParams.set('fields[3]', 'StartDate'); // startDate
  strapiApi.apiUrl.searchParams.set('fields[4]', 'EndDate'); // endDate
  //populate url
  strapiApi.apiUrl.searchParams.set('populate[0]', 'Image');
  strapiApi.apiUrl.searchParams.set('populate[1]', 'quests_platform');
  strapiApi.apiUrl.searchParams.set('populate[2]', 'quests_platform.Logo');
  strapiApi.apiUrl.searchParams.set('populate[3]]', 'BannerImage');
  strapiApi.apiUrl.searchParams.set('populate[4]]', 'CustomInformation');
  // //sort url
  // strapiApi.apiUrl.searchParams.set('sort[0]', 'id:desc');
  //filter url
  strapiApi.apiUrl.searchParams.set('pagination[pageSize]', '50');
  strapiApi.apiUrl.searchParams.set('filters[Points][$gte]', '0');
  const currentDate = new Date(Date.now()).toISOString().split('T')[0];
  strapiApi.apiUrl.searchParams.set('filters[StartDate][$lte]', currentDate);
  strapiApi.apiUrl.searchParams.set('filters[EndDate][$gte]', currentDate);
  return {
    ...strapiApi,
    filterBySlug(filterSlug: string) {
      this.apiUrl.searchParams.set('filters[Slug][$eq]', filterSlug);
      return this;
    },
  };
};

const createFeatureCardStrapiApi = () => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_FEATURE_CARDS });

  strapiApi.apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
  strapiApi.apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  strapiApi.apiUrl.searchParams.set(
    'filters[PersonalizedFeatureCard][$nei]',
    'true',
  );

  return strapiApi;
};

const createPersonalFeatureCardStrapiApi = (account?: Account | null) => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_JUMPER_USERS });

  strapiApi.apiUrl.searchParams.set('populate[0]', 'feature_cards');
  strapiApi.apiUrl.searchParams.set(
    'populate[feature_cards][populate][0]',
    'BackgroundImageLight',
  );
  strapiApi.apiUrl.searchParams.set(
    'populate[feature_cards][populate][1]',
    'BackgroundImageDark',
  );
  strapiApi.apiUrl.searchParams.set(
    'populate[feature_cards][populate][2]',
    'featureCardsExclusions',
  );
  if (account?.address && account.chainType === 'EVM') {
    strapiApi.apiUrl.searchParams.set(
      'filters[EvmWalletAddress][$eqi]',
      account?.address,
    );
  }

  return strapiApi;
};

const createPartnerThemeStrapiApi = () => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_PARTNER_THEMES });

  strapiApi.apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
  strapiApi.apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  strapiApi.apiUrl.searchParams.set('populate[2]', 'LogoLight');
  strapiApi.apiUrl.searchParams.set('populate[3]', 'LogoDark');
  strapiApi.apiUrl.searchParams.set('populate[4]', 'FooterImageLight');
  strapiApi.apiUrl.searchParams.set('populate[5]', 'FooterImageDark');
  strapiApi.apiUrl.searchParams.set('populate[6]', 'Bridges');
  strapiApi.apiUrl.searchParams.set('populate[7]', 'Exchanges');

  return {
    ...strapiApi,
    filterUid(uid: string) {
      this.apiUrl.searchParams.set('filters[uid][$eq]', uid);
      return this;
    },
  };
};

const createJumperUserStrapiApi = () => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_JUMPER_USERS });

  strapiApi.apiUrl.searchParams.set('populate[0]', 'feature_cards');
  strapiApi.apiUrl.searchParams.set(
    'populate[feature_cards][populate][0]',
    'BackgroundImageLight',
  );
  strapiApi.apiUrl.searchParams.set(
    'populate[feature_cards][populate][1]',
    'BackgroundImageDark',
  );

  return {
    ...strapiApi,
    addJumperUsersPersonalizedFCParams(account: Account | undefined) {
      if (account?.address && account?.chainType === 'EVM') {
        this.apiUrl.searchParams.set(
          'filters[EvmWalletAddress][$eqi]',
          account?.address,
        );
      }
      return this;
    },
  };
};

const createBlogFaqStrapiApi = () => {
  const strapiApi = createStrapiApi({ contentType: STRAPI_BLOG_ARTICLES });

  strapiApi.apiUrl.searchParams.set('populate[0]', 'faqItems');
  strapiApi.apiUrl.searchParams.set('filters[faqItems][featured][$eq]', 'true');

  return strapiApi;
};

export {
  createArticleStrapiApi,
  createBlogFaqStrapiApi,
  createFeatureCardStrapiApi,
  createJumperUserStrapiApi,
  createPartnerThemeStrapiApi,
  createPersonalFeatureCardStrapiApi,
  createQuestStrapiApi,
  createStrapiApi,
};
