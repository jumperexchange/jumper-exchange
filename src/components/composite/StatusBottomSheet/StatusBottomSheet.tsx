import { FC, useEffect, useRef } from 'react';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import Typography from '@mui/material/Typography';
import {
  BottomSheet,
  BottomSheetBase,
} from 'src/components/core/BottomSheet/BottomSheet';
import { Button } from 'src/components/Button/Button';
import {
  ErrorIconCircle,
  StyledModalContentContainer,
  StyledTitleContainer,
} from './StatusBottomSheet.styles';

interface StatusBottomSheetProps {
  title: string;
  description: string;
  callToAction: string;
  callToActionType: 'submit' | 'button';
  containerId: string;
  isOpen: boolean;
  onClick?: () => void;
  onClose?: () => void;
  onHeightChange?: (height: number) => void;
}

export const StatusBottomSheet: FC<StatusBottomSheetProps> = ({
  title,
  description,
  callToAction,
  callToActionType,
  containerId,
  isOpen,
  onClick,
  onClose,
  onHeightChange,
}) => {
  const bottomSheetRef = useRef<BottomSheetBase>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !bottomSheetRef.current?.isOpen()) {
      bottomSheetRef.current?.open();
    } else if (!isOpen && bottomSheetRef.current?.isOpen()) {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      bottomSheetRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !onHeightChange) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) {
        return;
      }
      const height = isOpen ? containerRef.current.offsetHeight : 0;
      onHeightChange(height);
    });

    resizeObserver.observe(containerRef.current);

    if (!isOpen) {
      onHeightChange(0);
    }

    return () => {
      resizeObserver.disconnect();
      if (!isOpen && onHeightChange) {
        onHeightChange(0);
      }
    };
  }, [isOpen, onHeightChange, containerRef.current]);

  useEffect(() => {
    return () => {
      bottomSheetRef.current?.close();
    };
  }, []);

  return (
    <BottomSheet
      containerId={containerId}
      ref={bottomSheetRef}
      backdropFilter="blur(16px)"
      onClose={onClose}
    >
      <StyledModalContentContainer
        ref={containerRef}
        sx={(theme) => ({
          padding: theme.spacing(3),
        })}
      >
        <ErrorIconCircle>
          <ErrorRounded />
        </ErrorIconCircle>

        <StyledTitleContainer>
          <Typography variant="titleXSmall">{title}</Typography>
        </StyledTitleContainer>

        <Typography variant="bodyMedium">{description}</Typography>

        {callToAction && (
          <Button
            fullWidth
            variant="primary"
            type={callToActionType}
            onClick={onClick}
          >
            {callToAction}
          </Button>
        )}
      </StyledModalContentContainer>
    </BottomSheet>
  );
};
