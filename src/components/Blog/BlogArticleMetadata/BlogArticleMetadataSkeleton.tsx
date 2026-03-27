import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { BadgeSkeleton } from '@/components/Badge/BadgeSkeleton';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { getTypographyStyles } from '@/utils/theme/isTypographyThemeKey';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';
import type { FC } from 'react';

interface BlogArticleMetadataSkeletonProps {
  tagSize?: BadgeSize;
  metaVariant?: TypographyProps['variant'];
  sx?: SxProps<Theme>;
}

export const BlogArticleMetadataSkeleton: FC<
  BlogArticleMetadataSkeletonProps
> = ({
  tagSize = BadgeSize.MD,
  metaVariant = 'bodyXSmall',
  sx = {
    flexDirection: 'column',
    gap: 1,
  },
}) => {
  return (
    <Stack useFlexGap sx={sx}>
      <Stack
        useFlexGap
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 0.5,
        }}
      >
        <BaseSurfaceSkeleton
          variant="text"
          sx={(theme) => ({
            height: getTypographyStyles(theme, metaVariant, 'bodyXSmall')
              .lineHeight,
            width: 160,
          })}
        />
      </Stack>
      <BadgeSkeleton size={tagSize} width={120} />
    </Stack>
  );
};
