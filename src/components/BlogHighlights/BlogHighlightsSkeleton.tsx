import type { Breakpoint } from '@mui/material';
import { Skeleton, useTheme } from '@mui/material';
import { getContrastAlphaColor } from 'src/utils';
import { BlogHighlightsCard, BlogHighlightsContent } from '.';

export const BlogHighlightsSkeleton = () => {
  const theme = useTheme();
  return (
    <BlogHighlightsCard key={`blog-highlights-skeleton`}>
      <BlogHighlightsContent>
        <Skeleton
          variant="text"
          sx={{
            width: '100%',
            borderRadius: '16px',
            height: 240,
            border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
          }}
        />
        <Skeleton
          variant="text"
          sx={{
            marginBottom: theme.spacing(3),
            height: 72,
          }}
        />
      </BlogHighlightsContent>
      <Skeleton
        variant="rectangular"
        sx={{
          borderRadius: '14px',
          height: 300,
          gridRow: '1',
          gridColumn: '1 / span 2',
          width: '100%',
          [theme.breakpoints.up('md' as Breakpoint)]: {
            gridRow: '1 / span 2',
            gridColumn: '2',
          },
        }}
      />
    </BlogHighlightsCard>
  );
};
