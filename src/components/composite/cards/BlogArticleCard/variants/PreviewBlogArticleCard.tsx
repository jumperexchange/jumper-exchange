import type { FC } from 'react';
import type { PreviewBlogArticleCardProps } from '../types';
import {
  BlogArticleCardContainer,
  BlogArticleCardContentContainer,
  BlogArticleCardHighlightText,
  BlogArticleCardImage,
} from '../BlogArticleCard.styles';

import { getTextEllipsisStyles } from '@/utils/styles/getTextEllipsisStyles';
import { PreviewBlogArticleCardSkeleton } from './PreviewBlogArticleCardSkeleton';

const highlightText = (text: string, highlight: string) => {
  if (!highlight?.trim()) {
    return <>{text}</>;
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

export const PreviewBlogArticleCard: FC<PreviewBlogArticleCardProps> = ({
  isLoading,
  data,
  baseUrl,
  highlight = '',
}) => {
  if (!data || isLoading) {
    return <PreviewBlogArticleCardSkeleton />;
  }

  const title = data.Title;
  const subtitle = data.Subtitle;
  return (
    <BlogArticleCardContainer>
      {data?.Image && (
        <BlogArticleCardImage
          src={`${baseUrl}${data?.Image?.formats.small.url || data?.Image?.url}`}
          alt={data?.Image?.alternativeText ?? data?.Title}
          width={0}
          height={0}
          sizes="100vw"
          draggable={false}
        />
      )}
      <BlogArticleCardContentContainer sx={{ gap: 0.5 }}>
        <BlogArticleCardHighlightText variant="titleXSmall">
          {highlightText(title, highlight)}
        </BlogArticleCardHighlightText>
        <BlogArticleCardHighlightText
          variant="bodySmallParagraph"
          color="textHint"
          sx={{ ...getTextEllipsisStyles(2) }}
        >
          {highlightText(subtitle, highlight)}
        </BlogArticleCardHighlightText>
      </BlogArticleCardContentContainer>
    </BlogArticleCardContainer>
  );
};
