import { BlogArticleCard } from '@/components/composite/cards/BlogArticleCard/BlogArticleCard';
import { AppPaths } from '@/const/urls';
import type { BlogArticleData } from '@/types/strapi';
import Link from 'next/link';
import type { FC } from 'react';
import { LearnPageSearchArticleListShell } from './LearnPageSearchArticleListShell';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';

interface LearnPageSearchArticleListProps {
  articles: BlogArticleData[];
  highlight?: string;
}

const baseUrl = getStrapiBaseUrl();

export const LearnPageSearchArticleList: FC<
  LearnPageSearchArticleListProps
> = ({ articles, highlight = '' }) => (
  <LearnPageSearchArticleListShell
    listKey={articles.map((a) => a.documentId).join(',')}
  >
    {articles.map((article) => (
      <Link
        key={article.documentId}
        href={article.RedirectURL ?? `${AppPaths.Learn}/${article.Slug}`}
        style={{ textDecoration: 'none' }}
      >
        <BlogArticleCard
          variant="preview"
          data={article}
          baseUrl={baseUrl}
          highlight={highlight}
        />
      </Link>
    ))}
  </LearnPageSearchArticleListShell>
);
