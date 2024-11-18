import { useMenuStore } from '@/stores/menu';
import { useAccount } from '@lifi/wallet-management';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingCategory } from 'src/const/trackingKeys';
import { getSiteUrl, JUMPER_SCAN_PATH } from 'src/const/urls';
import { useUserTracking } from 'src/hooks/userTracking';

export const useAddressMenuContent = () => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const closeAllMenus = useMenuStore((state) => state.closeAllMenus);
  const router = useRouter();
  const { setSnackbarState } = useMenuStore((state) => state);

  const handleCopyButton = (textToCopy: string) => {
    account?.address && navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  const handleScanButton = () => {
    const url = `${JUMPER_SCAN_PATH}/wallet/${account.address}`;
    trackEvent({
      category: TrackingCategory.AddressMenu,
      action: TrackingAction.OpenJumperScan,
      label: 'open-jumper-scan-wallet',
    });
    router.push(url);
  };

  return [
    {
      label: t('profile_page.shareProfile') as string,
      showMoreIcon: false,
      prefixIcon: (
        <LinkIcon
          sx={{
            height: '16px',
            color: isDarkMode
              ? theme.palette.white.main
              : theme.palette.black.main,
          }}
        />
      ),
      onClick: () => {
        handleCopyButton(`${getSiteUrl()}/profile/${account.address}`);
        closeAllMenus();
      },
    },
    {
      label: t('profile_page.open', { tool: 'explorer' }) as string,
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
    {
      label: t('profile_page.open', { tool: 'Jumper Scan' }) as string,
      showMoreIcon: false,
      prefixIcon: (
        <ReceiptLongIcon
          sx={{
            height: '16px',
            color: isDarkMode
              ? theme.palette.white.main
              : theme.palette.black.main,
          }}
        />
      ),
      onClick: () => {
        handleScanButton();
        closeAllMenus();
      },
    },
  ];
};
