import type { Breakpoint } from '@mui/material';
import { Skeleton, useTheme } from '@mui/material';
import {
  BlogHighlightsContent,
  BlogHighlightsDetails,
  BlogHightsContainer,
} from '.';

export const BlogHighlightsSkeleton = () => {
  const theme = useTheme();
  return (
    <BlogHightsContainer>
      <Skeleton
        variant="rectangular"
        component="img"
        sx={{
          borderRadius: '14px',
          aspectRatio: 1.782,
          width: '100%',
          height: '100%',
          userSelect: 'none',
          transform: 'unset',
          alignSelf: 'flex-start',
          boxShadow:
            theme.palette.mode === 'light'
              ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
              : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
          [theme.breakpoints.up('md' as Breakpoint)]: {
            alignSelf: 'center',
          },
          [theme.breakpoints.up('lg' as Breakpoint)]: {
            width: '54%',
          },
        }}
      />
      <BlogHighlightsContent sx={{ width: '100%' }}>
        <BlogHighlightsDetails>
          <Skeleton
            variant="rectangular"
            sx={{ height: '48px', width: '108px', borderRadius: '24px' }}
          />
          <Skeleton
            sx={{
              marginLeft: theme.spacing(3),
              height: '16px',
              width: '150px',
            }}
          />
        </BlogHighlightsDetails>
        <Skeleton
          sx={{
            margin: theme.spacing(4, 0),
            transform: 'unset',
            width: '100%',
            height: '168px',
          }}
        />
        <Skeleton sx={{ height: '64px' }} />
      </BlogHighlightsContent>
    </BlogHightsContainer>
  );
};
