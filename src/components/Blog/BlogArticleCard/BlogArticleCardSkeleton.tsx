import type { CSSObject } from '@mui/material';
import { Box, CardContent, Skeleton, useTheme } from '@mui/material';
import { getContrastAlphaColor } from 'src/utils';
import { BlogArticleCardContainer } from '.';

interface BlogArticleCardSkeletonProps {
  imageStyles?: CSSObject;
  contentStyles?: CSSObject;
  containerStyles?: CSSObject;
}

export const BlogArticleCardSkeleton = ({
  imageStyles,
  contentStyles,
  containerStyles,
}: BlogArticleCardSkeletonProps) => {
  const theme = useTheme();
  return (
    <BlogArticleCardContainer
      sx={{
        boxShadow: 'unset',
      }}
    >
      <Skeleton
        variant="rectangular"
        component="img"
        sx={{
          width: '100%',
          height: 240,
          borderRadius: '16px',
          transform: 'unset',
          border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
          aspectRatio: 1.6,
          ...imageStyles,
        }}
      />
      <CardContent
        sx={{
          margin: 0,
          padding: theme.spacing(2, 0),
          '&:last-child': { paddingBottom: theme.spacing(1) },
        }}
      >
        <Skeleton
          variant="text"
          sx={{
            width: '100%',
            height: '64px',
            transform: 'unset',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            marginTop: theme.spacing(2),
          }}
        >
          <Skeleton
            variant="text"
            sx={{
              width: '120px',
              height: 40,
              transform: 'unset',
              borderRadius: 20,
            }}
          />

          <Skeleton
            variant="text"
            sx={{
              width: 150,
              height: 16,
              transform: 'unset',
              marginLeft: theme.spacing(2),
            }}
          />
        </Box>
      </CardContent>
    </BlogArticleCardContainer>
  );
};
