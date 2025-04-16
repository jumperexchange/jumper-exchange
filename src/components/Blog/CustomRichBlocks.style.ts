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
    prop !== 'italic' &&
    prop !== 'quote' &&
    prop !== 'underline' &&
    prop !== 'strikethrough'
})<BlogParagraphProps>(({
  theme,
  underline,
  strikethrough,
}) => {
  // TODO: Fix this
  const textDecoration = underline
    ? 'underline'
    : strikethrough
      ? 'line-through'
      : 'auto';
  return {
    display: 'inline',
    fontWeight: 400,
    color: (theme.vars || theme).palette.text.secondary,
    textDecoration: textDecoration,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '32px',
    margin: theme.spacing(2, 0),
    variants: [
      {
        props: ({ bold }) => bold,
        style: {
          fontWeight: 700,
        },
      },
      {
        props: ({ italic }) => italic,
        style: {
          fontStyle: 'italic',
        },
      },
      {
        props: ({ quote }) => quote,
        style: {
          fontSize: '20px',
          fontStyle: 'italic',
        },
      },
    ],
  };
});

// Headings

export const BlogHeadline = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.88),
  a: {
    fontWeight: 600,
    textDecorationColor:
      alpha(theme.palette.accent1Alt.main, 0.4),
    ...theme.applyStyles("light", {
      textDecorationColor: alpha(theme.palette.primary.main, 0.04)
    })
  },
  'a:hover': {
    textDecorationColor:
      (theme.vars || theme).palette.accent1Alt.main,
    ...theme.applyStyles("light", {
      textDecorationColor: (theme.vars || theme).palette.primary.main
    })
  },
  '& a:not(:first-child)': {
    marginLeft: theme.spacing(0.5),
  },
  ...theme.applyStyles("light", {
    color: alpha(theme.palette.black.main, 0.88),
  })
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
    (theme.vars || theme).palette.accent1Alt.main,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline',
  fontSize: '18px',
  lineHeight: '32px',
  ':first-child': {
    marginLeft: 0,
  },
  ...theme.applyStyles("light", {
    color: (theme.vars || theme).palette.primary.main
  })
}));
