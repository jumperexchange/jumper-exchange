import type { FC, PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import Check from '@mui/icons-material/Check';
import Typography from '@mui/material/Typography';
import type {
  BottomSheetBase,
  BottomSheetProps,
} from 'src/components/core/BottomSheet/BottomSheet';
import { BottomSheet } from 'src/components/core/BottomSheet/BottomSheet';
import { Button } from 'src/components/Button/Button';
import {
  StatusIconCircle,
  StyledModalContentContainer,
  StyledTitleContainer,
} from './StatusBottomSheet.styles';

interface StatusBottomSheetProps extends PropsWithChildren {
  title: string;
  description?: string;
  callToAction?: string;
  callToActionType?: 'submit' | 'button';
  status?: 'error' | 'success';
  containerId: string;
  isOpen: boolean;
  onClick?: () => void;
  onClose?: () => void;
  onHeightChange?: (height: number) => void;
  transitionDuration?: BottomSheetProps['transitionDuration'];
}

export const StatusBottomSheet: FC<StatusBottomSheetProps> = ({
  title,
  children,
  description,
  callToAction,
  callToActionType = 'submit',
  status = 'error',
  containerId,
  isOpen,
  onClick,
  onClose,
  onHeightChange,
  transitionDuration,
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
    if (!containerRef.current || !onHeightChange) {
      return;
    }

    if (typeof ResizeObserver === 'undefined') {
      const height = isOpen ? containerRef.current.offsetHeight : 0;
      onHeightChange(height);
      return;
    }

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
  }, [isOpen, onHeightChange]);

  return (
    <BottomSheet
      containerId={containerId}
      ref={bottomSheetRef}
      backdropFilter="blur(16px)"
      onClose={onClose}
      transitionDuration={transitionDuration}
    >
      <StyledModalContentContainer
        ref={containerRef}
        sx={(theme) => ({
          padding: theme.spacing(3),
        })}
      >
        <StatusIconCircle status={status}>
          {status === 'error' ? <ErrorRounded /> : <Check />}
        </StatusIconCircle>

        <StyledTitleContainer>
          <Typography variant="titleXSmall">{title}</Typography>
        </StyledTitleContainer>

        {children ? (
          children
        ) : (
          <>
            {description && (
              <Typography variant="bodyMedium">{description}</Typography>
            )}

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
          </>
        )}
      </StyledModalContentContainer>
    </BottomSheet>
  );
};
