import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import type { TabProps } from 'src/components/Tabs';

export const useNavbarTabs = () => {
  const { trackEvent } = useUserTracking();
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const handleClickTab = (tab: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    // Only replace it if exists
    if (searchParams.has('toToken')) {
      searchParams.set('toToken', '0x0000000000000000000000000000000000000000');
    }

    let path = searchParams.toString();
    path = path.startsWith('?') ? path.substring(1) : path;

    router.push(`/${tab}?${path}`);
    trackEvent({
      category: TrackingCategory.Navigation,
      action: TrackingAction.SwitchTab,
      label: `switch_tab_to_${tab}`,
      data: { [TrackingEventParameter.Tab]: tab },
      enableAddressable: true,
    });
  };

  const output: TabProps[] = [
    {
      label: t('navbar.links.exchange'),
      onClick: () => () => handleClickTab(''),
      value: 0,
      icon: (
        <SwapHorizIcon
          sx={{
            marginRight: 0.75,
            marginBottom: `${theme.spacing(0)} !important`,
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.white.main
                : theme.palette.black.main,
          }}
        />
      ),
    },
    {
      label: t('navbar.links.refuel'),
      onClick: () => handleClickTab('gas'),
      value: 1,
      icon: (
        <EvStationOutlinedIcon
          sx={{
            marginRight: 0.75,
            marginBottom: `${theme.spacing(0)} !important`,
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.white.main
                : theme.palette.black.main,
          }}
        />
      ),
    },
    {
      label: t('navbar.links.buy'),
      onClick: () => handleClickTab('buy'),
      value: 2,
      icon: (
        <CreditCardIcon
          sx={{
            marginRight: 0.75,
            marginBottom: `${theme.spacing(0)} !important`,
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.white.main
                : theme.palette.black.main,
          }}
        />
      ),
      disabled: process.env.NEXT_PUBLIC_ONRAMPER_ENABLED !== 'true',
    },
  ];

  return output;
};
