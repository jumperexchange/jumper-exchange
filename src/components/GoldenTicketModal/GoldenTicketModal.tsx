import { Modal, Box, styled, useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { WinningLayout } from './WinningLayout';
import { ContactLayout } from './ContactLayout';
import { useAccount, useSignMessage } from 'wagmi';
import dynamic from 'next/dynamic';
import { NiceTryLayout } from './NiceTryLayout';
import {
  slideInFromBottom,
  slideOutToBottom,
  slideOutToRight,
  slideInFromRight,
  bagelFatOne,
  submitContact,
} from './utils';
import FinalLayout from './FinalLayout';
import { ErrorLayout } from './ErrorLayout';

const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

const GoldenTicketModalContainer = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  position: 'absolute',
  top: '8px',
  right: '8px',
  height: 'calc(100vh - 16px)',
  width: '700px',
  backgroundColor: '#5000FF',
  backgroundImage: 'url(/winning-modal-bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '16px',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  outline: 'none',
  fontFamily: bagelFatOne.style.fontFamily,
  animation: `${slideInFromRight} 0.5s ease-out`,
  overflow: 'hidden',

  [theme.breakpoints.down('md')]: {
    top: 'auto',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '80vh',
    borderRadius: '16px 16px 0 0',
    animation: `${slideInFromBottom} 0.5s ease-out`,
  },

  '&.closing': {
    animation: `${slideOutToRight} 0.5s ease-out`,
    [theme.breakpoints.down('md')]: {
      animation: `${slideOutToBottom} 0.5s ease-out`,
    },
  },
}));

interface GoldenTicketModalProps {
  onClose: () => void;
  isOpen: boolean;
  ticket: {
    winner: boolean;
    position: number | null;
  };
}

export const GoldenTicketModal: React.FC<GoldenTicketModalProps> = ({
  onClose,
  ticket,
  isOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isClosing, setIsClosing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [contact, setContact] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [layout, setLayout] = useState<
    'winning' | 'contact' | 'nice-try' | 'final' | 'error' | ''
  >(() => {
    if (hasSigned) {
      return 'final';
    }
    if (ticket.winner) {
      return 'winning';
    }
    if (!ticket.winner && ticket.position && ticket.position > 1) {
      return 'nice-try';
    }
    if (error) {
      return 'error';
    }
    return '';
  });

  useEffect(() => {
    if (hasSigned) {
      return setLayout('final');
    }
    if (ticket.winner) {
      return setLayout('winning');
    }
    if (!ticket.winner && ticket.position && ticket.position > 1) {
      return setLayout('nice-try');
    }
  }, [ticket.position, ticket.winner, hasSigned]);

  const handleCollect = () => {
    setLayout('contact');
  };

  const handleBack = () => {
    setLayout('winning');
  };

  const handleRetry = () => {
    setError('');
    setLayout('contact');
  };

  const handleContinue = async () => {
    try {
      if (!address || !contact) {
        setError('Account address or email is missing');
        setLayout('error');
        throw new Error('Account address or email is missing');
      }

      const timestamp = Date.now();

      const message = JSON.stringify({
        contact,
        timestamp,
        purpose: 'contact_verification',
      });

      setIsSigning(true);
      const signature = await signMessageAsync({
        message,
      });

      if (!signature) {
        return setIsSigning(false);
      }

      const response = await submitContact({
        address,
        signature,
        contact,
        timestamp,
      });

      setIsSigning(false);

      if (!response.success) {
        setError(response.message);
        throw new Error(response.message);
      }

      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setHasSigned(true);
        setLayout('final');
      }, 3000);

      setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setShowConfetti(false);
          setHasSigned(false);
          setContact('');
          setLayout('');
          setIsSigning(false);
          setIsClosing(false);
        }, 500);
      }, 8000);
    } catch (error) {
      console.error('Error in handleContinue:', error);
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setLayout('error');
      setIsSigning(false);
    }
  };

  const handleClose = (
    event?: {},
    reason?: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      // Do nothing, prevent close
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // Match the animation duration
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <GoldenTicketModalContainer className={isClosing ? 'closing' : ''}>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={600}
            gravity={0.8}
          />
        )}

        <WinningLayout
          onCollect={handleCollect}
          onClose={handleClose}
          isMobile={isMobile}
          isDisplay={layout === 'winning'}
        />

        <ContactLayout
          onBack={handleBack}
          onClose={handleClose}
          onContinue={handleContinue}
          isMobile={isMobile}
          contact={contact}
          setContact={setContact}
          isDisplay={layout === 'contact'}
          isSigning={isSigning}
        />

        <NiceTryLayout
          onClose={handleClose}
          isMobile={isMobile}
          isDisplay={layout === 'nice-try'}
          position={ticket.position}
        />

        <FinalLayout
          onClose={handleClose}
          isDisplay={layout === 'final'}
          isMobile={isMobile}
        />

        <ErrorLayout
          onClose={handleClose}
          isMobile={isMobile}
          isDisplay={layout === 'error'}
          error={error}
          onRetry={handleRetry}
        />
      </GoldenTicketModalContainer>
    </Modal>
  );
};
