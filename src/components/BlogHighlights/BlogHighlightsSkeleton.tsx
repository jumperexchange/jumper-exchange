import type { Breakpoint } from '@mui/material';
import { Skeleton, useTheme } from '@mui/material';
import { BlogHighlightsCard, BlogHighlightsContent } from '.';

export const BlogHighlightsSkeleton = () => {
  const theme = useTheme();
  return (
    <BlogHighlightsCard key={`blog-highlights-skeleton`} container>
      <BlogHighlightsContent>
        <Skeleton
          variant="text"
          sx={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            height: 120,
            [theme.breakpoints.up('md' as Breakpoint)]: {
              marginTop: theme.spacing(0),
            },
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
