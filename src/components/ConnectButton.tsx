'use client';
import { useWalletMenu } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';
import {
  ConnectButtonLabel,
  ConnectButtonStyle,
} from './ConnectButton/ConnectButton.style';

export const ConnectButton = () => {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  return (
    <ConnectButtonStyle
      // Used in the widget
      id="connect-wallet-button"
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
