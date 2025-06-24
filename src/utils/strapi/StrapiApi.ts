import type { Account } from '@lifi/wallet-management';
import { getStrapiBaseUrl } from './strapiHelper';

interface GetStrapiBaseUrlProps {
  contentType:
    | 'feature-cards'
    | 'blog-articles'
    | 'faq-items'
    | 'tags'
    | 'partner-themes'
    | 'quests'
    | 'campaigns';
}

interface PaginationProps {
  page: number;
  pageSize: number;
  withCount?: boolean;
}

class StrapiApi {
  protected baseUrl: string;
  protected contentType: GetStrapiBaseUrlProps['contentType'];
  protected apiUrl: URL;

  constructor({ contentType }: GetStrapiBaseUrlProps) {
    this.contentType = contentType;

    // Set up base URL
    this.baseUrl = getStrapiBaseUrl();

    // Set up API URL
    this.apiUrl = new URL(`${this.baseUrl}/api/${this.contentType}`);

    // Show drafts ONLY on development env
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
      this.apiUrl.searchParams.set('status', 'draft');
    }
  }

  getApiUrl(): string {
    return this.apiUrl.href;
  }

  addPaginationParams({
    page,
    pageSize,
    withCount = true,
  }: PaginationProps): this {
    this.apiUrl.searchParams.set('pagination[page]', `${page}`);
    this.apiUrl.searchParams.set('pagination[pageSize]', `${pageSize}`);
    this.apiUrl.searchParams.set('pagination[withCount]', `${withCount}`);
    return this;
  }
}

type ArticleField =
  | 'id'
  | 'Title'
  | 'Subtitle'
  | 'Slug'
  | 'RedirectURL'
  | 'featured'
  | 'WordCount'
  | 'Content'
  | 'publishedAt'
  | 'createdAt'
  | 'updatedAt';

const mainArticleFields: ArticleField[] = [
  'Title',
  'Subtitle',
  'Slug',
  'RedirectURL',
  'featured',
  'WordCount',
  'publishedAt',
  'createdAt',
  'updatedAt',
] as const;

class ArticleParams {
  private apiUrl: URL;

  private static defaultFields: ArticleField[] = [
    ...mainArticleFields,
    'Content',
  ];

  private static defaultPopulates = [
    'Image',
    'tags',
    'author.Avatar',
    'faq_items',
  ];

  constructor(apiUrl: URL) {
    this.apiUrl = apiUrl;
    this.apiUrl.searchParams.set('filters[Slug][$notNull]', 'true');
  }

  addParams({
    includeFields,
    excludeFields,
    populate = ArticleParams.defaultPopulates,
  }: {
    includeFields?: ArticleField[];
    excludeFields?: ArticleField[];
    populate?: string[];
  } = {}): URL {
    let fields = [...ArticleParams.defaultFields];

    if (includeFields) {
      fields = fields.filter((f) => includeFields.includes(f));
    }

    if (excludeFields) {
      fields = fields.filter((f) => !excludeFields.includes(f));
    }

    fields.forEach((field, index) => {
      this.apiUrl.searchParams.set(`fields[${index}]`, field);
    });

    populate.forEach((relation, index) => {
      this.apiUrl.searchParams.set(`populate[${index}]`, relation);
    });

    return this.apiUrl;
  }
}

type TagField = 'Title' | 'BackgroundColor' | 'TextColor';

class TagParams {
  private apiUrl: URL;

  private static defaultFields: TagField[] = [
    'Title',
    'BackgroundColor',
    'TextColor',
  ];

  private static defaultArticleFields: ArticleField[] = [...mainArticleFields];

  private static defaultArticlePopulates: string[] = ['Image'];

  constructor(apiUrl: URL) {
    this.apiUrl = apiUrl;
  }

  addParams({
    articleFields = TagParams.defaultArticleFields,
    articlePopulates = TagParams.defaultArticlePopulates,
  }: {
    articleFields?: ArticleField[];
    articlePopulates?: string[];
  } = {}): URL {
    const fields = [...TagParams.defaultFields];

    fields.forEach((field, index) => {
      this.apiUrl.searchParams.set(`fields[${index}]`, field);
    });

    // Populate blog_articles
    this.apiUrl.searchParams.set('populate[0]', 'blog_articles');

    // Nested populate under blog_articles
    articlePopulates.forEach((populate, index) => {
      this.apiUrl.searchParams.set(
        `populate[blog_articles][populate][${index}]`,
        populate,
      );
    });

    // Blog article fields
    articleFields.forEach((field, index) => {
      this.apiUrl.searchParams.set(
        `populate[blog_articles][fields][${index}]`,
        field,
      );
    });

    return this.apiUrl;
  }
}

class QuestParams {
  private apiUrl: URL;

  constructor(apiUrl: URL) {
    this.apiUrl = apiUrl;
  }

  addParams(): URL {
    this.apiUrl.searchParams.set('populate[0]', 'Image');
    this.apiUrl.searchParams.set('populate[1]', 'quests_platform');
    this.apiUrl.searchParams.set('populate[2]', 'quests_platform.Logo');
    this.apiUrl.searchParams.set('populate[3]', 'BannerImage');
    this.apiUrl.searchParams.set('populate[4]', 'tasks_verification');

    return this.apiUrl;
  }
}

class ArticleStrapiApi extends StrapiApi {
  constructor({
    includeFields,
    excludeFields,
  }: {
    includeFields?: ArticleField[];
    excludeFields?: ArticleField[];
  } = {}) {
    super({ contentType: 'blog-articles' }); // Set content type to "blog-articles" automatically
    const articleParams = new ArticleParams(this.apiUrl);
    this.apiUrl = articleParams.addParams({ includeFields, excludeFields });
  }

  sort(order: 'asc' | 'desc'): this {
    this.apiUrl.searchParams.set('sort', `publishedAt:${order.toUpperCase()}`);
    return this;
  }

  filterByTag(tags: number | number[]): this {
    if (typeof tags === 'string') {
      this.apiUrl.searchParams.set('filters[tags][id][$eq]', tags);
    } else if (Array.isArray(tags)) {
      tags.forEach((tag, index) => {
        this.apiUrl.searchParams.set(
          `filters[$and][0][$or][${index}][tags][id][$eq]`,
          `${tag}`,
        );
      });
    }
    return this;
  }

  filterBySlug(filterSlug: string): this {
    this.apiUrl.searchParams.set('filters[Slug][$eq]', filterSlug);
    return this;
  }

  filterByFeatured(): this {
    this.apiUrl.searchParams.set('filters[featured][$eq]', 'true');
    return this;
  }
}

class TagStrapiApi extends StrapiApi {
  constructor() {
    super({ contentType: 'tags' }); // Set content type to "blog-articles" automatically
    const tagParams = new TagParams(this.apiUrl);
    this.apiUrl = tagParams.addParams();
    this.apiUrl.searchParams.set('filters[blog_articles][$notNull]', 'true');
  }

  sort(order: 'asc' | 'desc'): this {
    this.apiUrl.searchParams.set('sort', `createdAt:${order.toUpperCase()}`);
    return this;
  }
}

class QuestStrapiApi extends StrapiApi {
  constructor() {
    super({ contentType: 'quests' }); // Set content type to "blog-articles" automatically
    const questParams = new QuestParams(this.apiUrl);
    this.apiUrl = questParams.addParams();
  }

  sort(order: 'asc' | 'desc'): this {
    this.apiUrl.searchParams.set('sort', `createdAt:${order.toUpperCase()}`);
    return this;
  }

  filterBySlug(filterSlug: string): this {
    this.filterBy('Slug', filterSlug);
    return this;
  }

  filterBy(key: string, value: string): this {
    this.apiUrl.searchParams.set(`filters[${key}][$eq]`, value);
    return this;
  }

  filterByStartAndEndDate(): this {
    const currentDate = new Date(Date.now()).toISOString().split('T')[0];
    this.apiUrl.searchParams.set('filters[StartDate][$lte]', currentDate);
    this.apiUrl.searchParams.set('filters[EndDate][$gte]', currentDate);
    return this;
  }

  filterByNoCampaignAttached(): this {
    this.apiUrl.searchParams.set('filters[campaign][$null]', 'true');
    return this;
  }

  filterByShowProfileBanner(): this {
    this.apiUrl.searchParams.set('filters[ShowProfileBanner][$eq]', 'true');
    return this;
  }

  populateCampaign(): this {
    this.apiUrl.searchParams.set('populate[5]', 'campaign');
    return this;
  }
}

class FeatureCardStrapiApi extends StrapiApi {
  constructor() {
    super({ contentType: 'feature-cards' }); // Set content type to "feature-cards" automatically
    this.addFeatureCardParams(); // Add specific parameters for feature cards
  }

  private addFeatureCardParams(): void {
    // populate images on feature card query
    this.apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
    this.apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
    this.apiUrl.searchParams.set(
      'filters[PersonalizedFeatureCard][$nei]',
      'true',
    );
  }
}

class PartnerThemeStrapiApi extends StrapiApi {
  constructor() {
    super({ contentType: 'partner-themes' }); // Set content type to "feature-cards" automatically
    this.addPartnerThemeParams(); // Add specific parameters for feature cards
  }

  private addPartnerThemeParams(): void {
    // populate images on feature card query
    this.apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
    this.apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
    this.apiUrl.searchParams.set('populate[2]', 'LogoLight');
    this.apiUrl.searchParams.set('populate[3]', 'LogoDark');
    this.apiUrl.searchParams.set('populate[4]', 'FooterImageLight');
    this.apiUrl.searchParams.set('populate[5]', 'FooterImageDark');
    this.apiUrl.searchParams.set('populate[6]', 'Bridges');
    this.apiUrl.searchParams.set('populate[7]', 'Exchanges');
  }

  filterUid(uid: string) {
    this.apiUrl.searchParams.set('filters[uid][$eq]', uid);
    return this;
  }
}

interface FilterPerrsonalFeatureCardsProps {
  account: Account | undefined;
}

class BlogFaqStrapiApi extends StrapiApi {
  constructor() {
    super({ contentType: 'blog-articles' }); // Set content type to "blog-articles" automatically
    this.addFaqParams(); // Add specific parameters for fetching FAQ items related to blog articles
    this.addFaqFeaturedFilterParams(); // Add specific parameters for filtering featured FAQ items
  }

  public addFaqParams(): void {
    // populate FAQ items related to blog articles
    this.apiUrl.searchParams.set('populate[0]', 'faqItems');
  }

  public addFaqFeaturedFilterParams(): void {
    // filter FAQ items to fetch only featured ones
    this.apiUrl.searchParams.set('filters[faqItems][featured][$eq]', 'true');
  }
}

class CampaignStrapiApi extends StrapiApi {
  constructor() {
    super({ contentType: 'campaigns' });
  }

  private addCampaignPageParams(): void {
    const currentDate = new Date().toISOString();
    this.apiUrl.searchParams.set('filters[StartDate][$lte]', currentDate);
    this.apiUrl.searchParams.set('filters[EndDate][$gte]', currentDate);
    this.apiUrl.searchParams.set('populate[0]', 'quests.Image');
    this.apiUrl.searchParams.set('populate[1]', 'Background');
    this.apiUrl.searchParams.set('populate[2]', 'Icon');
    this.apiUrl.searchParams.set('populate[3]', 'ProfileBannerImage');
    this.apiUrl.searchParams.set('populate[4]', 'merkl_rewards');
  }

  private addProfileBannerParams(): void {
    const currentDate = new Date().toISOString();
    this.apiUrl.searchParams.set('filters[StartDate][$lte]', currentDate);
    this.apiUrl.searchParams.set('filters[EndDate][$gte]', currentDate);
    this.apiUrl.searchParams.set('fields[0]', 'ProfileBannerTitle');
    this.apiUrl.searchParams.set('fields[1]', 'ProfileBannerDescription');
    this.apiUrl.searchParams.set('fields[2]', 'ProfileBannerBadge');
    this.apiUrl.searchParams.set('fields[3]', 'ProfileBannerCTA');
    this.apiUrl.searchParams.set('fields[4]', 'Slug');
    this.apiUrl.searchParams.set('populate[0]', 'ProfileBannerImage');
  }

  useCampaignPageParams(): this {
    this.addCampaignPageParams();
    return this;
  }

  useCampaignBannerParams(): this {
    this.addProfileBannerParams();
    return this;
  }

  filterBySlug(slug: string): this {
    this.apiUrl.searchParams.set('filters[Slug][$eq]', slug);
    return this;
  }

  filterByShowProfileBanner(): this {
    this.apiUrl.searchParams.set('filters[ShowProfileBanner][$eq]', 'true');
    return this;
  }
}

export {
  ArticleStrapiApi,
  BlogFaqStrapiApi,
  CampaignStrapiApi,
  FeatureCardStrapiApi,
  PartnerThemeStrapiApi,
  QuestStrapiApi,
  StrapiApi,
  TagStrapiApi,
};
