import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const BaseFlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const RequestRedeemModalFormContainer = styled(BaseFlexContainer)(
  ({ theme }) => ({
    maxHeight: 'calc(100vh - 12rem)',
    overflow: 'hidden',
  }),
);

export const RequestRedeemModalWrapperContainer = styled(BaseFlexContainer)(
  ({ theme }) => ({
    flex: 1,
    overflow: 'hidden',
  }),
);

export const RequestRedeemModalContentContainer = styled(BaseFlexContainer)(
  ({ theme }) => ({
    height: 'auto',
    overflow: 'auto',
    padding: theme.spacing(0, 3, 3),
  }),
);

export const RequestRedeemModalFieldsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const RequestRedeemModalHeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 0),
}));
