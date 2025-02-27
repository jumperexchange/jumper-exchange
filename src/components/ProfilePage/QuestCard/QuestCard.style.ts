import type { BoxProps } from '@mui/material';
import {
  Box,
  Button,
  Skeleton,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import Image from 'next/image';

export const QuestCardMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : alpha(theme.palette.white.main, 0.08),
  borderRadius: '24px',
  flexDirection: 'column',
  height: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: 288,
  overflow: 'hidden',
  minWidth: 288,
  textAlign: 'center',
  transition: 'background-color 250ms',
  boxShadow: theme.shadows[2],
}));

export const QuestCardImage = styled(Image)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  aspectRatio: '1 / 1',
}));

export const QuestCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '20px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
}));

export const QuestCardTitleBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  height: '32px',
}));

export const QuestCardTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  userSelect: 'none',
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxHeight: '24px',
  whiteSpace: 'nowrap',
}));

export const QuestCardTitleSkeleton = styled(Skeleton)(() => ({
  width: '100%',
  minWidth: 100,
  height: 24,
  borderRadius: '12px',
}));

export const QuestCardInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: theme.spacing(2, 0),
  svg: {
    flexShrink: 0,
  },
}));

export const RewardsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  flexWrap: 'nowrap',
  justifyContent: 'flex-end',
}));

export const QuestPlatformMainBox = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}));

export interface XPDisplayBoxProps extends BoxProps {
  active?: boolean;
  completed?: boolean;
}

export const XPDisplayBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed',
})<XPDisplayBoxProps>(({ theme }) => ({
  display: 'flex',
  color: theme.palette.primary.main,
  backgroundColor: '#F0E5FF',
  height: 32,
  alignItems: 'center',
  borderRadius: '128px',
  padding: theme.spacing(0.5, 0.75),
  justifyContent: 'center',
  ':not(last-of-type)': {
    marginRight: theme.spacing(1),
  },
  variants: [
    {
      props: ({ completed }) => completed,
      style: {
        color: '#00B849',
      },
    },
    {
      props: ({ completed }) => completed,
      style: {
        backgroundColor: '#D6FFE7',
      },
    },
  ],
}));

export const XPDisplayBoxLabel = styled(Typography)(({ theme }) => {
  return {
    margin: theme.spacing(0, 0.5),
    color: 'inherit',
    userSelect: 'none',
  };
});

export const BadgeRelativeBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1,
}));

export const AbsoluteCenterTraitsBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  cursor: 'help',
  backgroundColor: '#653ba3', //'rgba(84, 49, 136, 0.4)',
  borderRadius: '32px',
  padding: theme.spacing(0.5, 2),
  marginTop: theme.spacing(1),
}));

export const QuestCardButtonSkeleton = styled(Skeleton)(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
  height: 24,
  borderRadius: '12px',
}));

export const QuestCardButtonCta = styled(Button)(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
  height: 24,
  color: theme.palette.text.primary,
  transition: 'background-color 300ms',
  backgroundColor: alpha(theme.palette.text.primary, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.08),
  },
}));

export const CompletedBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#d6ffe7',
  justifyContent: 'center',
  borderRadius: '128px',
  padding: '4px',
}));

export const QuestCardButtonCtaLabel = styled(Typography)(({ theme }) => ({
  userSelect: 'none',
  margin: theme.spacing(0, 1),
}));

export const CompletedTypography = styled(QuestCardButtonCtaLabel)(() => ({
  color: '#00B849',
}));
