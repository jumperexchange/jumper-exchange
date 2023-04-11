import { Chain } from '@lifi/types';
import { wallets } from '@lifi/wallet-management/wallets';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  MenuContextProps,
  SettingsContextProps,
} from '@transferto/shared/src/types';
import { walletDigest } from '@transferto/shared/src/utils/walletDigest';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../../const';
import { useChainInfos } from '../../../providers/ChainInfosProvider';
import { useWallet } from '../../../providers/WalletProvider';
import { useSettingsStore } from '../../../stores';
import { useMenuStore } from '../../../stores/menu';
import { MenuListItem, TWallets } from '../../../types';

const ConnectedMenuItems = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.walletMenu.';
  const copiedToClipboard = useMenuStore(
    (state: MenuContextProps) => state.copiedToClipboard,
  );
  const onCopyToClipboard = useMenuStore(
    (state: MenuContextProps) => state.onCopyToClipboard,
  );
  const onWalletDisconnect = useSettingsStore(
    (state: SettingsContextProps) => state.onWalletDisconnect,
  );
  const theme = useTheme();
  const { account, usedWallet, disconnect } = useWallet();

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const { chains, isSuccess } = useChainInfos();
  const activeChain = useMemo(
    () => chains.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
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
  }, [usedWallet, walletSource]);

  const _ConnectedMenuItems: MenuListItem[] = [
    {
      label: !!activeChain?.name
        ? `${activeChain?.name}`
        : `${translate(`${i18Path}switchChain`)}`,
      prefixIcon: !!activeChain?.logoURI ? (
        <Avatar
          src={!!activeChain ? activeChain.logoURI : 'empty'}
          alt={`${!!activeChain?.name ? activeChain.name : ''}chain-logo`}
          sx={{ height: '32px', width: '32px' }}
        />
      ) : (
        <ChangeCircleOutlinedIcon sx={{ height: '32px', width: '32px' }} />
      ),
      triggerSubMenu: SubMenuKeys.chains,
    },
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
        onCopyToClipboard(true);
      },
      showMoreIcon: false,
      suffixIcon: !!copiedToClipboard ? (
        <CheckIcon sx={{ color: theme.palette.success.main }} />
      ) : (
        <ContentCopyIcon />
      ),
    },
    {
      label: `${translate(`${i18Path}disconnect`)}`,
      prefixIcon: <PowerSettingsNewIcon />,
      showButton: true,
      onClick: () => {
        disconnect();
        onWalletDisconnect();
      },
    },
  ];

  return _ConnectedMenuItems;
};

export default ConnectedMenuItems;
