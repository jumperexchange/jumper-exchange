import { Box, alpha, styled } from '@mui/material';

export const QuestCardMainBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: '392px',
  width: '272px',
  borderRadius: '24px',
  textAlign: 'center',
}));

export const QuestCardBottomBox = styled(Box)(({ theme }) => ({
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 32,
  paddingRight: 32,
}));

export const QuestCardTitleBox = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  height: '32px',
}));

export const QuestCardInfoBox = styled(Box)(({ theme }) => ({
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
