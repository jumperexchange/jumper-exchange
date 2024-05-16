import { Typography, alpha, styled } from '@mui/material';

// Paragraph

export const BlogParagraph = styled(Typography)(({ theme }) => ({
  color: alpha(
    theme.palette.mode === 'light'
      ? theme.palette.black.main
      : theme.palette.white.main,
    0.75,
  ),
  margin: theme.spacing(2, 0),
  fontSize: '18px',
  lineHeight: '32px',
  fontWeight: 400,
}));

// Headings
export const BlogH1 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(6),
}));

export const BlogH2 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(3),
}));

export const BlogH3 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(2),
}));

export const BlogH4 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1.5),
}));

export const BlogH5 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

export const BlogH6 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
}));
