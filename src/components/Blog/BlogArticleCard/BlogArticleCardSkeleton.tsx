import type { SxProps, Theme } from '@mui/material/styles';
import {
  BlogArticleCardContainer,
  BlogArticleCardContent,
  BlogArticleCardDetails,
  BlogArticleCardImageSkeleton,
  BlogArticleCardTitleSkeleton,
} from './BlogArticleCard.style';
import type { FC } from 'react';
import { mergeSx } from '@/utils/theme/mergeSx';
import { BlogArticleMetadataSkeleton } from '../BlogArticleMetadata/BlogArticleMetadataSkeleton';

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
          <BlogArticleMetadataSkeleton />
        </BlogArticleCardDetails>
      </BlogArticleCardContent>
    </BlogArticleCardContainer>
  );
};
