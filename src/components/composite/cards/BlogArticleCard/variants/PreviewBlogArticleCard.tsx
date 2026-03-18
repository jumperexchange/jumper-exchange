import type { FC } from 'react';
import type { PreviewBlogArticleCardProps } from '../types';
import {
  BlogArticleCardContainer,
  BlogArticleCardContentContainer,
  BlogArticleCardHighlightText,
  BlogArticleCardImage,
} from '../BlogArticleCard.styles';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import { JUMPER_STRAPI_URL } from '@/const/urls';
import { getTextEllipsisStyles } from '@/utils/styles/getTextEllipsisStyles';
import { PreviewBlogArticleCardSkeleton } from './PreviewBlogArticleCardSkeleton';

const highlightText = (text: string, highlight: string) => {
  if (!highlight?.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span>{part}</span>
        ),
      )}
    </>
  );
};

export const PreviewBlogArticleCard: FC<PreviewBlogArticleCardProps> = ({
  isLoading,
  data,
  highlight = '',
}) => {
  //   const baseUrl = getStrapiBaseUrl();
  //   console.log(baseUrl);

  if (!data || isLoading) {
    return <PreviewBlogArticleCardSkeleton />;
  }

  const title = data.Title;
  const subtitle = data.Subtitle;
  return (
    <BlogArticleCardContainer>
      {data?.Image && (
        <BlogArticleCardImage
          src={`${JUMPER_STRAPI_URL}${data?.Image?.formats.small.url || data?.Image?.url}`}
          alt={data?.Image?.alternativeText ?? data?.Title}
          width={0}
          height={0}
          sizes="100vw"
          draggable={false}
        />
      )}
      <BlogArticleCardContentContainer gap={0.5}>
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
