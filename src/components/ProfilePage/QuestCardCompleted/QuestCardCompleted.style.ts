import type { BoxProps } from '@mui/material';
import { Box, alpha, darken, styled } from '@mui/material';

export const QuestCardMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : alpha(theme.palette.white.main, 0.08),
  height: 416,
  width: 272,
  borderRadius: '24px',
  textAlign: 'center',
  padding: theme.spacing(2),
  transition: 'background-color 250ms',
}));

export const QuestCardBottomBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
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

export interface QuestCardInfoBoxProps extends Omit<BoxProps, 'component'> {
  points?: number;
}

export const QuestCardInfoBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'points',
})<QuestCardInfoBoxProps>(({ points }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: points ? 'space-between' : 'flex-end',
}));

export const CompletedBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#d6ffe7',
  borderRadius: '128px',
  padding: '4px',
  width: 110,
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
}

export const XPDisplayBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<XPDisplayBoxProps>(({ active }) => ({
  width: active ? '50%' : '100%',
  ...(active && { marginRight: theme.spacing(1)}),
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  borderRadius: '128px',
  padding: '6px',
  justifyContent: 'center',
}));
