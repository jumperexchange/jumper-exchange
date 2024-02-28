import type { Breakpoint } from '@mui/material';
import { Skeleton, useTheme } from '@mui/material';
import {
  FeaturedArticleContainer,
  FeaturedArticleContent,
  FeaturedArticleDetails,
} from '.';

export const FeaturedArticleSkeleton = () => {
  const theme = useTheme();
  return (
    <FeaturedArticleContainer>
      <Skeleton
        variant="rectangular"
        component="img"
        sx={{
          borderRadius: '14px',
          aspectRatio: 550 / 309,
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
      <FeaturedArticleContent sx={{ width: '100%' }}>
        <FeaturedArticleDetails>
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
        </FeaturedArticleDetails>
        <Skeleton
          sx={{
            margin: theme.spacing(4, 0),
            transform: 'unset',
            width: '100%',
            height: '168px',
          }}
        />
        <Skeleton sx={{ height: '64px' }} />
      </FeaturedArticleContent>
    </FeaturedArticleContainer>
  );
};
