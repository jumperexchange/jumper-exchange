import { BlogArticleCard } from '@/components/composite/cards/BlogArticleCard/BlogArticleCard';
import { AppPaths } from '@/const/urls';
import type { BlogArticleData } from '@/types/strapi';
import Link from 'next/link';
import type { FC } from 'react';
import { LearnPageSearchArticleListShell } from './LearnPageSearchArticleListShell';

interface LearnPageSearchArticleListProps {
  articles: BlogArticleData[];
  highlight?: string;
}

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
          highlight={highlight}
        />
      </Link>
    ))}
  </LearnPageSearchArticleListShell>
);
