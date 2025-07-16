import { AnimatePresence, motion } from 'framer-motion';
import { bagelFatOne, interTight } from './utils';
import { Typography } from '@mui/material';
import { styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { SVGProps } from 'react';

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

interface FinalLayoutProps {
  onClose: () => void;
  isDisplay: boolean;
  isMobile: boolean;
}

export default function FinalLayout({
  onClose,
  isDisplay,
  isMobile,
}: FinalLayoutProps) {
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
          Thank you!
        </StyledTypography>

        <StyledTypography
          variant="h4"
          marginY={2}
          color="white"
          fontSize={isMobile ? '18px' : '24px'}
          lineHeight={isMobile ? '24px' : '32px'}
          maxWidth={'600px'}
          fontWeight={'normal'}
          marginTop={'24px'}
          marginLeft={isMobile ? '16px' : '40px'}
          fontFamily={interTight.style.fontFamily}
          sx={{ textTransform: 'none' }}
          textAlign={'center'}
        >
          The Jumper team will contact you shortly.
        </StyledTypography>

        <div
          style={{
            marginTop: isMobile ? '30px' : '80px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MarkIcon isMobile={isMobile} />
        </div>
      </LayoutContainer>
    </AnimatePresence>
  );
}

const MarkIcon = ({
  isMobile,
  props,
}: {
  isMobile?: boolean;
  props?: SVGProps<SVGSVGElement>;
}) => {
  return (
    <svg
      {...props}
      width={isMobile ? '200' : '250'}
      height={isMobile ? '200' : '250'}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_89_1588)">
        <path
          d="M92.9993 13.0002C94.9297 14.6647 96.3125 15.6962 94.9362 17.7648L94.5561 18.2652L48.3575 71.8452L21.7662 49.3045C19.6597 47.5189 20.7137 45.6066 22.4993 43.5002C24.1475 41.5557 25.6486 39.9417 27.7287 41.3005L28.2323 41.6763L47.2543 57.8002L86.9827 11.7351C88.7859 9.64375 90.9079 11.1969 92.9993 13.0002Z"
          fill="white"
        />
        <path
          d="M50 0C59.4363 0 68.4985 2.62312 76.3469 7.49755C78.6927 8.95448 76.9569 10.6542 75.5 13C74.0431 15.3458 73.4167 17.4494 71.0709 15.9925C64.7952 12.0948 57.5581 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 46.8897 89.646 43.8294 88.9518 40.8585C88.3235 38.1695 90.311 37.6283 93 37C95.689 36.3717 98.0612 35.8942 98.6895 38.5832C99.5576 42.2986 100 46.1223 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_89_1588">
          <rect width="100" height="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
