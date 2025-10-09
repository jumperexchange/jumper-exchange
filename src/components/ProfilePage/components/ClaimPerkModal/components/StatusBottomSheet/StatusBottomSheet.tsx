import { FC, useEffect, useRef } from 'react';
import {
  BottomSheet,
  BottomSheetBase,
} from 'src/components/core/BottomSheet/BottomSheet';
import {
  ErrorIconCircle,
  StyledModalContentContainer,
  StyledTitleContainer,
} from '../../ClaimPerkModal.styles';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import Typography from '@mui/material/Typography';
import { Button } from 'src/components/Button/Button';

interface StatusBottomSheetProps {
  title: string;
  description: string;
  callToAction: string;
  callToActionType: 'submit' | 'button';
  containerId: string;
  isOpen: boolean;
  onClick?: () => void;
}

export const StatusBottomSheet: FC<StatusBottomSheetProps> = ({
  title,
  description,
  callToAction,
  callToActionType,
  containerId,
  isOpen,
  onClick,
}) => {
  const bottomSheetRef = useRef<BottomSheetBase>(null);

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

  return (
    <BottomSheet
      containerId={containerId}
      ref={bottomSheetRef}
      backdropFilter="blur(16px)"
    >
      <StyledModalContentContainer
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
