import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import { ButtonPrimary } from 'src/components/Button/Button.style';
import { IconButton } from 'src/components/IconButton';

export const StyledTitleContainer = styled(Box)(() => ({
  width: '100%',
  textAlign: 'center',
}));

export const StyledMultiStepTitleContainer = styled(StyledTitleContainer)(
  () => ({
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 40,
  }),
);

export const StyledTitleIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  height: 40,
  width: 40,
  position: 'absolute',
  left: 0,
  top: 0,
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  mt: theme.spacing(3),
  width: '100%',
  padding: theme.spacing(0, 3.5),
  '& .MuiStepConnector-root': {
    top: '10px',
    left: 'calc(-50% + 24px)',
    right: 'calc(50% + 24px)',
  },
  '& .MuiStepConnector-line': {
    border: 'none',
    borderRadius: '2px',
    height: '4px',
    backgroundColor: (theme.vars || theme).palette.grey[100],
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '0%',
      backgroundColor: (theme.vars || theme).palette.primary.main,
      borderRadius: '2px',
      transition: 'width 0.4s ease-in-out',
    },
  },
  '& .MuiStepConnector-root.Mui-active, & .MuiStepConnector-root.Mui-completed':
    {
      '& .MuiStepConnector-line::before': {
        width: '100%',
      },
    },

  '& .MuiStepLabel-label, & .MuiStepLabel-label.MuiStepLabel-alternativeLabel':
    {
      paddingTop: theme.spacing(1),
      marginTop: 0,
      color: (theme.vars || theme).palette.text.secondary,
      transition: 'color 0.3s ease',
    },
  '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed': {
    color: (theme.vars || theme).palette.text.primary,
  },
}));

export const StyledActiveStepContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

// @Note we can expand this to use other statuses
export const ErrorIconCircle = styled(Box)(({ theme }) => {
  return {
    backgroundColor: (theme.vars || theme).palette.statusErrorBg,
    borderRadius: '50%',
    width: 96,
    height: 96,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    '& > svg': {
      color: (theme.vars || theme).palette.statusErrorFg,
      width: 48,
      height: 48,
    },
  };
});

export const StyledModalContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const StyledModalSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(5),
}));

export const StyledModalSectionHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const StyledTextSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  width: '100%',
}));
