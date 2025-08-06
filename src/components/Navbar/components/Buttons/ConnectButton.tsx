import { ConnectNavbarButtonLabel, ConnectNavbarButton } from './Buttons.style';
import { useWalletMenu } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';

function ConnectButton() {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  return (
    <ConnectNavbarButton
      // Used in the widget
      id="connect-wallet-button"
      onClick={(event) => {
        event.stopPropagation();
        openWalletMenu();
      }}
    >
      <ConnectNavbarButtonLabel
        sx={{
          typography: {
            xs: 'bodyXSmallStrong',
            sm: 'bodySmallStrong',
          },
        }}
      >
        {t('navbar.connect')}
      </ConnectNavbarButtonLabel>
    </ConnectNavbarButton>
  );
}

export default ConnectButton;
