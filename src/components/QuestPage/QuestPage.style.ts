import { Box, styled } from '@mui/material';

export const QuestsContainer = styled(Box)(() => ({
  background: 'transparent',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
  paddingBottom: 20,
}));

export const QuestPageMainBox = styled(Box)(() => ({
  minWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
}));
