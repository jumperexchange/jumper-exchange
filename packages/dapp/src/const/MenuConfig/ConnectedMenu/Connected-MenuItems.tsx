import { Chain } from '@lifi/types';
import { wallets } from '@lifi/wallet-management/wallets';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { walletDigest } from '@transferto/shared';
import { useSettings } from '@transferto/shared/src/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainInfos } from '../../../providers/ChainInfosProvider';
import { useMenu } from '../../../providers/MenuProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { MenuListItem, TWallets } from '../../../types';

const ConnectedMenuItems = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.WalletMenu.';
  const settings = useSettings();
  const menu = useMenu();
  const theme = useTheme();
  const { account, usedWallet, disconnect } = useWallet();

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const { chains, isSuccess } = useChainInfos();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains.length, account.chainId],
  );

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
      label: !!activeChain?.name
        ? `${activeChain?.name}`
        : `${translate(`${i18Path}SwitchChain`)}`,
      listIcon: !!activeChain?.logoURI ? (
        <Avatar
          src={!!activeChain ? activeChain.logoURI : 'empty'}
          alt={`${!!activeChain?.name ? activeChain.name : ''}chain-logo`}
          sx={{ height: '32px', width: '32px' }}
        />
      ) : (
        <ChangeCircleOutlinedIcon sx={{ height: '32px', width: '32px' }} />
      ),
      triggerSubMenu: 'chains',
    },
    {
      label: `${_walletDigest}`,
      listIcon: (
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
        menu.onCopyToClipboard(true);
      },
      extraIcon: !!menu.copiedToClipboard ? (
        <CheckIcon sx={{ color: theme.palette.success.main }} />
      ) : (
        <ContentCopyIcon />
      ),
    },
    {
      label: `${translate(`${i18Path}Disconnect`)}`,
      listIcon: <PowerSettingsNewIcon />,
      showButton: true,
      textColor:
        theme.palette.mode === 'dark'
          ? theme.palette.white.main
          : theme.palette.primary.main,
      bgColor: theme.palette.mode === 'dark' ? '#653BA3' : '#E9E1F5',
      onClick: () => {
        disconnect();
        settings.onWalletDisconnect();
      },
    },
  ];

  return _ConnectedMenuItems;
};

export default ConnectedMenuItems;
