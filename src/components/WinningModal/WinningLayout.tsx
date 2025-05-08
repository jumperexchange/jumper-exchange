import { Typography, Box, styled } from '@mui/material';
import { Button } from '@/components/Button';
import CloseIcon from '@mui/icons-material/Close';
import { bagelFatOne, interTight } from './utils';
import { AnimatePresence, motion } from 'framer-motion';
import UnicornScene from '../UnicornScene/UnicornScene';

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

const TextContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: '16px',
});

interface WinningLayoutProps {
  onClose: () => void;
  onCollect: () => void;
  isMobile: boolean;
  isDisplay: boolean;
}

export const WinningLayout = ({
  onClose,
  onCollect,
  isMobile,
  isDisplay,
}: WinningLayoutProps) => {
  return (
    <AnimatePresence>
      <LayoutContainer
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: isDisplay ? 1 : 0,
          x: isDisplay ? 0 : -100,
        }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
        style={{ display: isDisplay ? 'flex' : 'none' }}
      >
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>

        <TextContainer>
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
        </TextContainer>

        <div
          style={{
            scale: isMobile ? 1 : 0.9,
            width: '100%',
            height: '100%',
          }}
        >
          <UnicornScene
            projectId="m4fo5UXVxF5iqkKIweQn?production"
            scale={0.8}
            dpi={2}
            fps={60}
            altText="Golden Ticket Animation"
            ariaLabel="Animated golden ticket scene"
            lazyLoad={false}
            isMobile={isMobile}
          />
        </div>

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
          onClick={onCollect}
        >
          Collect
        </Button>
      </LayoutContainer>
    </AnimatePresence>
  );
};
