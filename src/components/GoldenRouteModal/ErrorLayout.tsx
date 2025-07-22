import { AnimatePresence, motion } from 'framer-motion';
import { interTight } from './utils';
import { Typography } from '@mui/material';
import { bagelFatOne } from './utils';
import { styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button';

const LayoutContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: '16px',
});

const StyledTypography = styled(Typography)({
  fontFamily: bagelFatOne.style.fontFamily,
});

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

interface ErrorLayoutProps {
  onClose: () => void;
  isMobile: boolean;
  isDisplay: boolean;
  error: string;
  onRetry: () => void;
}

export const ErrorLayout = ({
  onClose,
  isMobile,
  isDisplay,
  error,
  onRetry,
}: ErrorLayoutProps) => {
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
          An error occurred
        </StyledTypography>

        <StyledTypography
          variant="h4"
          textAlign="left"
          marginY={2}
          color="#FF09D3"
          fontSize={isMobile ? '18px' : '24px'}
          lineHeight={isMobile ? '24px' : '32px'}
          maxWidth={'600px'}
          fontWeight={'normal'}
          marginTop={'24px'}
          marginLeft={isMobile ? '16px' : '40px'}
          fontFamily={interTight.style.fontFamily}
          sx={{ textTransform: 'none' }}
        >
          {error}
        </StyledTypography>

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
          onClick={onRetry}
        >
          Try again
        </Button>
      </LayoutContainer>
    </AnimatePresence>
  );
};
