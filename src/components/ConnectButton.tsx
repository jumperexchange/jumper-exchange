'use client';
import { useWalletMenu } from '@lifi/wallet-management';
import type { SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ConnectButtonLabel,
  ConnectButtonStyle,
} from './ConnectButton/ConnectButton.style';

interface ConnectButtonProps {
  sx?: SxProps<Theme>;
  id?: string;
  label?: string;
}

export const ConnectButton = ({ sx, id, label }: ConnectButtonProps) => {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  return (
    <ConnectButtonStyle
      // Used in the widget
      sx={sx}
      size="small"
      id={id || 'connect-wallet-button'}
      onClick={(event) => {
        event.stopPropagation();
        openWalletMenu();
      }}
    >
      <ConnectButtonLabel variant={'bodyMediumStrong'}>
        {label || t('navbar.connect')}
      </ConnectButtonLabel>
    </ConnectButtonStyle>
  );
};
