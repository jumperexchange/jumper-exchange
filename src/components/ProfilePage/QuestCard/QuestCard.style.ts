import type { BoxProps } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';

export const QuestCardMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 450,
  width: 288,
  textAlign: 'center',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
}));

export const QuestCardBottomBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '33%',
  flexGrow: 1,
  padding: theme.spacing(2, 2, 3)
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
}));

export const QuestCardTitleBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  textAlign: 'left',
}));

export interface QuestCardInfoBoxProps extends Omit<BoxProps, 'component'> {
  points?: number;
}

export const QuestCardInfoBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'points',
})<QuestCardInfoBoxProps>(({ points }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const CompletedBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#d6ffe7',
  borderRadius: '128px',
  padding: '4px',
  width: '50%',
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

export interface XPDisplayBoxProps extends Omit<BoxProps, 'component'> {
  active?: boolean;
}

export const XPDisplayBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<XPDisplayBoxProps>(({ active }) => ({
  marginRight: active ? '8px' : undefined,
  display: 'flex',
  height: '28px',
  alignContent: 'center',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '128px',
  padding: theme.spacing(1)
}));

export const XPIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignContent: 'flex-end',
  justifyContent: 'flex-end',
}));

export const OPBadgeRelativeBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  bottom: '16px',
  right: '32px',
}));
