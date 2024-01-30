import { Box, Card, Skeleton, useTheme, type Breakpoint } from '@mui/material';

import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from 'src/utils';

export const BlogArticlesBoardPaginationSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <Skeleton
            variant="circular"
            width="40"
            height="40"
            key={`pagination-skeleton-${index}`}
          />
        );
      })}
    </Box>
  );
};

export const BlogArticleCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  border: 'unset',
  padding: theme.spacing(1),
  borderRadius: '24px',
  background: 'transparent',
  transition: 'background-color 250ms',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 250,
    width: 420,
  },
  '&:hover': {
    cursor: 'pointer',
    background:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark100.main
        : theme.palette.alphaLight400.main,
  },
}));

export const BlogArticleCardImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
}));
