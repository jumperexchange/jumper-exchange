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
      ? '#FFFFFF'
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
}));

export const QuestCardTitleSkeleton = styled(Skeleton)(() => ({
  width: '100%',
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

export interface QuestPlatformMainBoxProps extends Omit<BoxProps, 'component'> {
  platformName?: string;
}

export const QuestPlatformMainBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'platformName',
})<QuestPlatformMainBoxProps>(({ platformName }) => ({
  display: 'flex',
  justifyContent: platformName ? 'space-between' : 'flex-end',
  alignItems: 'center',
}));

export const QuestDatesBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.black.main, 0.04)
      : theme.palette.alphaLight300.main,
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '8px',
  paddingRight: '8px',
  borderRadius: '128px',
  justifyContent: 'center',
}));

export interface XPDisplayBoxProps extends Omit<BoxProps, 'component'> {
  active?: boolean;
  completed?: boolean;
}

export const XPDisplayBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed',
})<XPDisplayBoxProps>(({ active, theme, completed }) => ({
  marginRight: active ? '8px' : undefined,
  display: 'flex',
  backgroundColor: completed ? '#42B852' : '#F0E5FF',
  height: 32,
  alignItems: 'center',
  borderRadius: '128px',
  padding: theme.spacing(0.5, 0.75),
  justifyContent: 'center',
}));

export const XPDisplayBoxLabel = styled(Typography)<XPDisplayBoxProps>(
  ({ theme }) => ({
    margin: theme.spacing(0, 0.5),
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.accent1Alt.main,
    userSelect: 'none',
  }),
);

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

export const QuestCardButtonCta = styled(Button)(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
  height: 24,
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.text.primary, 0.04),
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

export const CompletedTypography = styled(QuestCardButtonCtaLabel)(
  ({ theme }) => ({
    color: '#00B849',
  }),
);
