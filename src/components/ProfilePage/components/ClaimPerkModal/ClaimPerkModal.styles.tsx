import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
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
}));

export const StyledStep = styled(Step)(({ theme }) => ({
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
      display: 'block',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      height: '100%',
      width: '0%',
      borderRadius: '2px',
      backgroundColor: 'transparent',
      transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
      willChange: 'width, background-color',
      transform: 'translate(0, 0)',
    },
  },
  '& .MuiStepConnector-root.Mui-active, & .MuiStepConnector-root.Mui-completed':
    {
      '& .MuiStepConnector-line::before': {
        backgroundColor: (theme.vars || theme).palette.primary.main,
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

export const StyledStepIconBox = styled(Box)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  padding: theme.spacing(0.5),
  backgroundColor: (theme.vars || theme).palette.grey[100],
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.1s ease-in-out',
  transform: 'translate(0, 0)',

  '.Mui-active &, .Mui-completed &': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
  },
}));

export const StyledActiveStepContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
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
