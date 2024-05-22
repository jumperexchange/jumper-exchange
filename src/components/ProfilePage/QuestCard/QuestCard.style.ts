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
  padding: theme.spacing(2),
}));

export const QuestCardBottomBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const QuestCardTitleBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  height: '32px',
}));

export const QuestCardInfoBox = styled(Box)(() => ({
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
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

export const QuestPlatformMainBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

export const XPDisplayBox = styled(Box)(({ theme, style }) => ({
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
