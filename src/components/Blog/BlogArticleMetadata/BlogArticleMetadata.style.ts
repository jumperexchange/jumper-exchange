import Typography, { type TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const BlogArticleMetaProperty = styled(Typography)<TypographyProps<'p'>>(
  ({ theme }) => ({
    fontWeight: 500,
    '&:not(:last-child):after': {
      content: '"•"',
      margin: theme.spacing(0, 0.5),
    },
  }),
);
