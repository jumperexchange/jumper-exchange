import type { BoxProps } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';

export const BannerMainBox = styled(Box)(({ theme }) => ({
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: '550px',
  textAlign: 'center',
  overflow: 'hidden',
  borderRadius: '8px',
}));

export const BannerBottomBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
  padding: '32px',
  backgroundColor: '#fdfbef',
}));

export const BannerTitleBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
}));

export interface BannerInfoBoxProps extends Omit<BoxProps, 'component'> {
  points?: number;
}

export const BannerInfoBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'points',
})<BannerInfoBoxProps>(({ points }) => ({
  display: 'flex',
  flexDirection: 'column',
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

export const SuperfestPageMainBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
}));

export const BannerImageBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '60%',
}));

export const DateChainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'center',
}));

export const SupportedChainsBox = styled(Box)(() => ({
  ml: '8px',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const RewardLeftBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  alignContent: 'center',
  ml: '20px',
}));
