import type { TypographyProps } from '@mui/material';
import { Typography, alpha, styled } from '@mui/material';
import Link from 'next/link';

// Paragraph
interface BlogParagraphProps extends TypographyProps {
  bold?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  italic?: boolean;
  quote?: boolean;
}

export const BlogParagraph = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'bold' &&
    prop !== 'underline' &&
    prop !== 'italic' &&
    prop !== 'strikethrough' &&
    prop !== 'quote',
})<BlogParagraphProps>(({
  theme,
  bold,
  underline,
  strikethrough,
  italic,
  quote,
}) => {
  const textDecoration = underline
    ? 'underline'
    : strikethrough
      ? 'line-through'
      : 'auto';
  return {
    display: 'inline',
    fontWeight: bold ? 700 : 400,
    color: theme.palette.text.secondary,
    textDecoration: textDecoration,
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: '18px',
    lineHeight: '32px',
    margin: theme.spacing(2, 0),
    ...(quote && {
      fontSize: '20px',
      fontStyle: 'italic',
    }),
  };
});

// Headings

export const BlogHeadline = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.88),
  a: {
    fontWeight: 600,
    textDecorationColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.04)
        : alpha(theme.palette.accent1Alt.main, 0.4),
  },
  'a:hover': {
    textDecorationColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.accent1Alt.main,
  },
  '& a:not(:first-child)': {
    marginLeft: theme.spacing(0.5),
  },
}));

export const BlogH1 = styled(BlogHeadline)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(6),
}));

export const BlogH2 = styled(BlogHeadline)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(3),
}));

export const BlogH3 = styled(BlogHeadline)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(2),
}));

export const BlogH4 = styled(BlogHeadline)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1.5),
}));

export const BlogH5 = styled(BlogHeadline)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

export const BlogH6 = styled(BlogHeadline)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
}));

export const BlogLink = styled(Link)(({ theme }) => ({
  marginLeft: theme.spacing(0.75),
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.accent1Alt.main,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline',
  fontSize: '18px',
  lineHeight: '32px',
  ':first-child': {
    marginLeft: 0,
  },
}));
