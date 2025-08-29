import Box from '@mui/material/Box';
import { alpha, darken, styled } from '@mui/material/styles';
import { Link } from '../Link';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { urbanist } from 'src/fonts/fonts';
import { IconButtonPrimary } from '../IconButton';

// Heading styles

interface HeadingProps extends TypographyProps {
  level?: number;
}

export const Heading = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'level',
})<HeadingProps>(({ theme }) => ({
  color: (theme.vars || theme).palette.alpha800.main,
  a: {
    fontWeight: 600,
    color: (theme.vars || theme).palette.text.primary,
    textDecorationColor: alpha(theme.palette.primary.main, 0.04),
    transition: 'all 0.3s ease-in-out',
  },
  'a:hover': {
    textDecorationColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.main,
  },
  '& a:not(:first-child)': {
    marginLeft: theme.spacing(0.5),
  },
  variants: [
    {
      props: ({ level }) => level === 1,
      style: {
        marginTop: theme.spacing(12),
        marginBottom: theme.spacing(6),
      },
    },
    {
      props: ({ level }) => level === 2,
      style: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(3),
      },
    },
    {
      props: ({ level }) => level === 3,
      style: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(2),
      },
    },
    {
      props: ({ level }) => level === 4,
      style: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(1.5),
      },
    },
    {
      props: ({ level }) => level === 5,
      style: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
      },
    },
    {
      props: ({ level }) => level === 6,
      style: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(0.5),
      },
    },
  ],
}));

// Paragraph styles

export const ParagraphBlockContainer = styled(Box)(({}) => ({}));

export const ParagraphLink = styled(Link)(({ theme }) => ({
  marginLeft: theme.spacing(0.75),
  color: (theme.vars || theme).palette.accent1Alt.main,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline',
  ':first-child': {
    marginLeft: 0,
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

// Paragraph
interface ParagraphProps extends TypographyProps {
  bold?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  italic?: boolean;
  quote?: boolean;
}

export const Paragraph = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'bold' &&
    prop !== 'italic' &&
    prop !== 'quote' &&
    prop !== 'underline' &&
    prop !== 'strikethrough',
})<ParagraphProps>(({ underline, strikethrough }) => {
  // TODO: Fix this
  const textDecoration = underline
    ? 'underline'
    : strikethrough
      ? 'line-through'
      : 'auto';
  return {
    display: 'inline',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    color: 'inherit',
    fontStyle: 'normal',
    textDecoration: textDecoration,
    variants: [
      {
        props: ({ bold }) => bold,
        style: {
          fontWeight: 700,
        },
      },
      {
        props: ({ italic, quote }) => italic || quote,
        style: {
          fontStyle: 'italic',
        },
      },
    ],
  };
});

// CTA styles

export const CtaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(8),
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  overflow: 'hidden',
  textAlign: 'center',
  margin: theme.spacing(6, 0),
  transition: 'background-color 250ms',
  borderRadius: '16px',
  //todo: add to theme
  backgroundColor: alpha(theme.palette.white.main, 0.08),
  '&:hover': {
    cursor: 'pointer',
    //todo: add to theme
    backgroundColor: alpha(theme.palette.white.main, 0.16),
    ...theme.applyStyles('light', {
      backgroundColor: darken('#F9F5FF', 0.02),
    }),
  },
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(4),
    flexDirection: 'row',
  },
  ...theme.applyStyles('light', {
    backgroundColor: '#F9F5FF',
  }),
}));

export const CtaTitle = styled(Box)(({ theme }) => ({
  fontFamily: urbanist.style.fontFamily,
  fontWeight: 700,
  color: (theme.vars || theme).palette.accent1Alt.main,
  fontSize: '32px',
  lineHeight: '38px',
  userSelect: 'none',
  [theme.breakpoints.up('sm')]: {
    fontSize: '40px',
    lineHeight: '56px',
    textDecoration: 'auto',
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

export const CtaButton = styled(IconButtonPrimary)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

// Widget styles

export const WidgetHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(3),
}));
