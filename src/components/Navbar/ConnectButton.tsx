import { ConnectButtonLabel, ConnectButtonWrapper } from './WalletButton.style';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';

function ConnectButton() {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  return (
    <ConnectButtonWrapper
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
    </ConnectButtonWrapper>
  );
}

export default ConnectButton;
