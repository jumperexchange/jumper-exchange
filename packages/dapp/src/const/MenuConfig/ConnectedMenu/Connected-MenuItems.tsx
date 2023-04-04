import { wallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Avatar from '@mui/material/Avatar';
import useTheme from '@mui/material/styles/useTheme';
import { useSettings } from '@transferto/shared/src/hooks';
import { walletDigest } from '@transferto/shared/src/utils/walletDigest';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainInfos } from '../../../providers/ChainInfosProvider';
import { useMenu } from '../../../providers/MenuProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem, TWallets } from '../../../types';

const useConnectedMenu = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.walletMenu.';
  const settings = useSettings();
  const menu = useMenu();
  const theme = useTheme();
  const { account, usedWallet, disconnect } = useWallet();

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const { chains, isSuccess } = useChainInfos();

  const walletSource: TWallets = wallets;
  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      const walletKey: any = Object.keys(walletSource).filter(
        (el) => walletSource[el].name === localStorage.activeWalletName,
      );
      return walletSource[walletKey]?.icon || '';
    }
  }, [account]);

  const _ConnectedMenuItems: MenuListItem[] = [
    {
      label: `${_walletDigest}`,
      prefixIcon: (
        <Avatar
          src={walletIcon}
          // alt={`${!!usedWallet.name ? usedWallet.name : ''}wallet-logo`}
          sx={{
            height: '32px',
            width: '32px',
          }}
        />
      ),
      onClick: () => {
        navigator?.clipboard?.writeText(account.address);
      },
      showMoreIcon: false,
      suffixIcon: <ContentCopyIcon />,
    },
    {
      label: `${translate(`${i18Path}disconnect`)}`,
      prefixIcon: <PowerSettingsNewIcon />,
      showButton: true,
      onClick: () => {
        disconnect();
        settings.onWalletDisconnect();
      },
    },
  ];

  return _ConnectedMenuItems;
};

export default useConnectedMenu;
