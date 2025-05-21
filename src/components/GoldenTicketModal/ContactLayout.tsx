import { Typography, styled, TextField, CircularProgress } from '@mui/material';
import { Button } from '@/components/Button';
import CloseIcon from '@mui/icons-material/Close';
import { bagelFatOne, interTight } from './utils';
import { ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const BackButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  position: 'absolute',
  backgroundColor: 'transparent',
  border: 'none',
  fontFamily: interTight.style.fontFamily,
  cursor: 'pointer',
  top: isMobile ? '16px' : '52px',
  left: isMobile ? '16px' : '40px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: '12px',
  lineHeight: '16px',
}));

const CloseButton = styled('button')({
  position: 'absolute',
  top: '16px',
  right: '16px',
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: interTight.style.fontFamily,
  fontSize: '12px',
  fontWeight: 'bold',
});

const StyledTypography = styled(Typography)({
  fontFamily: bagelFatOne.style.fontFamily,
});

const Input = styled(TextField)({
  width: '100%',
  marginBottom: '24px',
  '& .MuiOutlinedInput-root': {
    background: 'white',
    borderRadius: '16px',
    color: '#000',
    fontSize: '24px',
    fontWeight: 400,
    padding: '14px 5px 0',
    boxShadow: 'none',
    minHeight: '80px',
    border: 'none',
    '& fieldset': {
      border: 'none',
    },
    '& input::placeholder': {
      color: '#0000004D',
      opacity: 1,
    },
  },
});

const LayoutContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: '16px',
});

const InputWrapper = styled('label')({
  display: 'flex',
  width: 'calc(100% - 80px)',
  justifyContent: 'start',
  marginTop: '72px',
  position: 'relative',
  marginLeft: '40px',
});

const FieldName = styled('p')({
  position: 'absolute',
  top: '0',
  left: '20px',
  fontSize: '12px',
  lineHeight: '16px',
  textTransform: 'uppercase',
  fontWeight: '700',
  fontFamily: interTight.style.fontFamily,
});

const ErrorMessage = styled('p')<{ isMobile: boolean }>(({ isMobile }) => ({
  position: 'absolute',
  bottom: isMobile ? '-5px' : '-10px',
  left: '10px',
  fontWeight: 'bold',
  color: '#FF09D3',
  fontFamily: interTight.style.fontFamily,
  fontSize: isMobile ? '10px' : '12px',
  lineHeight: '16px',
  marginTop: '4px',
}));

interface ContactLayoutProps {
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  isMobile: boolean;
  contact: string;
  setContact: (contact: string) => void;
  isDisplay: boolean;
  isSigning: boolean;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const telegramRegex = /^@[a-zA-Z0-9_]+$/;

export const ContactLayout = ({
  onBack,
  onClose,
  onContinue,
  isMobile,
  contact,
  setContact,
  isDisplay,
  isSigning,
}: ContactLayoutProps) => {
  const [isValidInput, setIsValidInput] = useState(false);

  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target?.value &&
      (e.target.value.match(emailRegex) || e.target.value.match(telegramRegex))
    ) {
      setIsValidInput(true);
    } else {
      setIsValidInput(false);
    }
  };

  return (
    <AnimatePresence>
      <LayoutContainer
        initial={{ opacity: 0, x: 100 }}
        animate={{
          opacity: isDisplay ? 1 : 0,
          x: isDisplay ? 0 : 100,
        }}
        exit={{ opacity: 0, x: 100 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{ display: isDisplay ? 'flex' : 'none' }}
      >
        <BackButton onClick={onBack} isMobile={isMobile}>
          <ChevronRight sx={{ transform: 'rotate(180deg)' }} />
          Back
        </BackButton>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <StyledTypography
          variant="h4"
          textAlign="left"
          marginY={2}
          color="white"
          fontSize={isMobile ? '42px' : '62px'}
          lineHeight={isMobile ? '42px' : '62px'}
          maxWidth={'600px'}
          textTransform={'uppercase'}
          fontWeight={'extra-bold'}
          marginTop={'80px'}
          marginLeft={isMobile ? '16px' : '40px'}
        >
          WOW! it's a golden ticket!
        </StyledTypography>

        <InputWrapper>
          <Input
            type="text"
            placeholder="Email or @telegram"
            variant="outlined"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              validateInput(e as React.ChangeEvent<HTMLInputElement>);
            }}
            fullWidth
          />
          <FieldName>Email or Telegram tag</FieldName>
          {!isValidInput && contact !== '' && (
            <ErrorMessage isMobile={isMobile}>
              Please enter a valid email address or Telegram tag (should start
              with @)
            </ErrorMessage>
          )}
        </InputWrapper>

        <Button
          muiVariant="contained"
          styles={{
            fontFamily: interTight.style.fontFamily,
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            backgroundColor: 'white !important',
            color: 'black !important',
            fontSize: isMobile ? '14x' : '16px',
            fontWeight: 'bold',
            borderRadius: '1000px',
            padding: isMobile ? '16px 40px' : '35px 55px',
          }}
          disabled={!isValidInput || contact === ''}
          onClick={onContinue}
        >
          {isSigning ? <CircularProgress size={24} /> : 'Continue'}
        </Button>
      </LayoutContainer>
    </AnimatePresence>
  );
};
