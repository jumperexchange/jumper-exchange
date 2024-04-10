export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface SitemapRoute {
  loc: string;
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

export type SitemapPages = SitemapPage[];

export interface SitemapPage {
  path: string;
  priority: number;
}
