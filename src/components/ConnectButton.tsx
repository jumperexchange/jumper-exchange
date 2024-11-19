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
}

export const ConnectButton = ({ sx, id }: ConnectButtonProps) => {
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
        {t('navbar.connect')}
      </ConnectButtonLabel>
    </ConnectButtonStyle>
  );
};
