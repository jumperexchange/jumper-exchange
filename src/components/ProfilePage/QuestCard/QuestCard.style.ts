import type { BoxProps } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';

export const QuestCardMainBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: '416px',
  width: '272px',
  borderRadius: '24px',
  textAlign: 'center',
  overflow: 'hidden',
}));

export const QuestCardBottomBox = styled(Box)(() => ({
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  paddingRight: 16,
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
  marginTop: '16px',
  flexDirection: 'row',
  alignItems: 'center',
  display: 'flex',
  justifyContent: points ? 'space-between' : 'flex-end', //todo: double-check
}));

export const CompletedBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
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
  justifyContent: platformName ? 'space-between' : 'flex-end', //todo: check css for this
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
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
  marginRight: active ? '8px' : undefined,
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  borderRadius: '128px',
  borderStyle: 'solid',
  padding: '6px',
  borderWidth: '1px',
  borderColor: '#e7d6ff',
  justifyContent: 'center',
}));
