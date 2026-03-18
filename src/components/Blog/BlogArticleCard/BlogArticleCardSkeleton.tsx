import type { SxProps, Theme } from '@mui/material/styles';
import {
  BlogArticleCardContainer,
  BlogArticleCardContent,
  BlogArticleCardDetails,
  BlogArticleCardImageSkeleton,
  BlogArticleCardMetaContainer,
  BlogArticleCardMetaSkeleton,
  BlogArticleCardTagSkeleton,
  BlogArticleCardTitleSkeleton,
} from './BlogArticleCard.style';
import type { FC } from 'react';
import { mergeSx } from '@/utils/theme/mergeSx';

interface BlogArticleCardSkeletonProps {
  sx?: SxProps<Theme>;
}

export const BlogArticleCardSkeleton: FC<BlogArticleCardSkeletonProps> = ({
  sx,
}) => {
  return (
    <BlogArticleCardContainer
      sx={mergeSx(
        {
          boxShadow: 'unset',
        },
        sx,
      )}
    >
      <BlogArticleCardImageSkeleton variant="rectangular" />
      <BlogArticleCardContent>
        <BlogArticleCardTitleSkeleton variant="text" />
        <BlogArticleCardDetails>
          <BlogArticleCardTagSkeleton variant="text" />
          <BlogArticleCardMetaContainer hasTags={true}>
            <BlogArticleCardMetaSkeleton variant="text" />
          </BlogArticleCardMetaContainer>
        </BlogArticleCardDetails>
      </BlogArticleCardContent>
    </BlogArticleCardContainer>
  );
};
