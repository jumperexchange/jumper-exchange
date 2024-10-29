import { useMenuStore } from '@/stores/menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material/styles';

import { useAccount } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';
export const useAddressContent = () => {
  const { account } = useAccount();
  const { setSnackbarState } = useMenuStore((state) => state);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const closeAllMenus = useMenuStore((state) => state.closeAllMenus);

  const handleCopyButton = () => {
    account?.address && navigator.clipboard.writeText(account.address);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return [
    {
      label: t('profile_page.copyAddress') as string,
      showMoreIcon: false,
      prefixIcon: (
        <ContentCopyIcon
          sx={{
            height: '16px',
            color: isDarkMode
              ? theme.palette.white.main
              : theme.palette.black.main,
          }}
        />
      ),
      onClick: () => {
        handleCopyButton();
        closeAllMenus();
      },
    },
    {
      label: t('profile_page.openBlockchainExplorer') as string,
      showMoreIcon: false,
      prefixIcon: (
        <OpenInNewIcon
          sx={{
            height: '16px',
            color: isDarkMode
              ? theme.palette.white.main
              : theme.palette.black.main,
          }}
        />
      ),
      onClick: () => {
        closeAllMenus();
      },
      link: {
        url: `https://etherscan.io/address/${account.address}`,
        external: true,
      },
    },
  ];
};
