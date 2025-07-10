'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography } from '@mui/material';
import type { JSX } from 'react';
import { ButtonSecondary } from 'src/components/Button';
import { useWalletHacked } from 'src/components/WalletHacked/context/WalletHackedContext';
import { getPreviousStep } from 'src/components/WalletHacked/utils/stepNavigation';
import { ModalMenuContent, ModalMenuHeader } from './ModalMenuPage.style';

export const ModalMenuPage = ({
  title,
  buttonLabel,
  content,
  text,
  onClickAction,
  error,
  // index,
  showPrevButton,
  // setMenuIndex,
  hideClose = false,
  disabled = false,
}: {
  title?: string;
  buttonLabel: string;
  text?: string;
  content?: JSX.Element;
  onClickAction: (event: React.MouseEvent) => void;
  error?: string;
  showPrevButton?: boolean;
  hideClose?: boolean;
  disabled?: boolean;
}) => {
  const { currentStep, setCurrentStep } = useWalletHacked();

  return (
    <>
      <ModalMenuHeader>
        {showPrevButton ? (
          <IconButton
            size="medium"
            aria-label="settings"
            edge="start"
            sx={(theme) => ({
              marginLeft: 0,
              color: (theme.vars || theme).palette.text.primary,
              '&:hover': {
                backgroundColor: (theme.vars || theme).palette.grey[100],
              },
            })}
            onClick={(event) => {
              event.stopPropagation();
              setCurrentStep(getPreviousStep(currentStep));
              console.log('prev button clicked');
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <span style={{ width: '40px' }} />
        )}
        <Typography variant="titleXSmall">{title}</Typography>
        <span style={{ width: '40px' }} />
      </ModalMenuHeader>
      {text && (
        <Typography
          variant="bodyMedium"
          sx={{
            marginBottom: 2,
            padding: '0 24px',
          }}
        >
          {text}
        </Typography>
      )}
      {content && <ModalMenuContent>{content}</ModalMenuContent>}
      {error && (
        <Typography
          variant="bodyMedium"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.error.main,
            marginBottom: 2,
            padding: '0 24px',
          })}
        >
          {error}
        </Typography>
      )}
      {buttonLabel && (
        <ButtonSecondary
          sx={{ color: '#200052' }}
          onClick={onClickAction}
          disabled={disabled}
        >
          <Typography
            variant="bodyMediumStrong"
            component="span"
            sx={(theme) => ({
              color: (theme.vars || theme).palette.text.primary,
            })}
          >
            {buttonLabel}
          </Typography>
        </ButtonSecondary>
      )}
    </>
  );
};
