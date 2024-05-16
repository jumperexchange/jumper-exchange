import type { TypographyProps } from '@mui/material';
import { Typography, alpha, styled } from '@mui/material';
import Link from 'next/link';

// Paragraph
interface BlogParagraphProps extends TypographyProps {
  bold?: boolean;
  textDecoration?: 'underline' | 'strke-through' | 'auto';
  italic?: boolean;
}

export const BlogParagraph = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'bold' && prop !== 'textDecoration' && prop !== 'italic',
})<BlogParagraphProps>(({ theme, bold, textDecoration, italic }) => ({
  display: 'inline',
  fontWeight: bold ? 700 : 400,
  color: alpha(
    theme.palette.mode === 'light'
      ? theme.palette.black.main
      : theme.palette.white.main,
    0.75,
  ),
  textDecoration: textDecoration || 'auto',
  fontStyle: italic ? 'italic' : 'normal',
  fontSize: '18px',
  lineHeight: '32px',
  margin: theme.spacing(2, 0),
}));

// Headings

export const BlogHeadline = styled(Typography)(({ theme }) => ({
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