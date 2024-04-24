import { Typography, alpha, styled } from '@mui/material';
import { urbanist } from 'src/fonts/fonts';

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
  fontFamily: urbanist.style.fontFamily,
  fontSize: '64px',
  lineHeight: '64px',
  fontWeight: 700,
}));

export const BlogH2 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(3),
  fontFamily: urbanist.style.fontFamily,
  fontSize: '36px',
  lineHeight: '48px',
  fontWeight: 700,
}));

export const BlogH3 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(2),
  fontFamily: urbanist.style.fontFamily,
  fontSize: '28px',
  lineHeight: '36px',
  fontWeight: 700,
}));

export const BlogH4 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1.5),
  fontFamily: urbanist.style.fontFamily,
  fontSize: '22px',
  lineHeight: '28px',
  fontWeight: 700,
}));

export const BlogH5 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  fontFamily: urbanist.style.fontFamily,
  fontSize: '18px',
  lineHeight: '24px',
  fontWeight: 700,
}));

export const BlogH6 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
  fontFamily: urbanist.style.fontFamily,
  fontSize: '12px',
  lineHeight: '18px',
  fontWeight: 700,
}));
