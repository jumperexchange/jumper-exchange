import type { FC, PropsWithChildren } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import type {
  BottomSheetBase,
  BottomSheetProps,
} from 'src/components/core/BottomSheet/BottomSheet';
import { BottomSheet } from 'src/components/core/BottomSheet/BottomSheet';
import { Button } from 'src/components/Button/Button';
import {
  StatusIconCircle,
  StyledButtonGroup,
  StyledModalContentContainer,
  StyledTitleContainer,
} from './StatusBottomSheet.styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/utils/theme/mergeSx';

export interface StatusBottomSheetProps extends PropsWithChildren {
  title: string;
  description?: string;
  callToAction: string;
  callToActionType: 'submit' | 'button';
  secondaryCallToAction?: string;
  containerId: string;
  isOpen: boolean;
  onClick?: () => void;
  onSecondaryClick?: () => void;
  onClose?: () => void;
  onHeightChange?: (height: number) => void;
  transitionDuration?: BottomSheetProps['transitionDuration'];
  status?: 'success' | 'error' | 'info';
  sx?: SxProps<Theme>;
}

export const StatusBottomSheet: FC<StatusBottomSheetProps> = ({
  title,
  description,
  callToAction,
  callToActionType,
  secondaryCallToAction,
  containerId,
  isOpen,
  onClick,
  onSecondaryClick,
  onClose,
  onHeightChange,
  transitionDuration,
  status = 'error',
  sx,
  children,
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

  const statusIcon = useMemo(() => {
    switch (status) {
      case 'success':
        return <CheckIcon />;
      case 'error':
        return <ErrorRounded />;
      case 'info':
        return <InfoIcon />;
    }
  }, [status]);

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
        sx={mergeSx(sx, (theme) => ({
          padding: theme.spacing(3),
        }))}
      >
        <StatusIconCircle status={status}>{statusIcon}</StatusIconCircle>

        <StyledTitleContainer>
          <Typography variant="titleXSmall">{title}</Typography>
        </StyledTitleContainer>

        {description && (
          <Typography variant="bodyMedium">{description}</Typography>
        )}

        {children}

        <StyledButtonGroup>
          {secondaryCallToAction && (
            <Button
              fullWidth
              variant="secondary"
              type="button"
              onClick={onSecondaryClick}
            >
              {secondaryCallToAction}
            </Button>
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
        </StyledButtonGroup>
      </StyledModalContentContainer>
    </BottomSheet>
  );
};
