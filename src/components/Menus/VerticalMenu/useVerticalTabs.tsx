import { AB_TEST_NAME } from '@/const/abtests';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useABTest } from '@/hooks/useABTest';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useAccount } from '@lifi/wallet-management';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const useVerticalTabs = () => {
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const { account } = useAccount();

  const tradeABTest = useABTest({
    feature: AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY,
    address: account?.address ?? '',
  });

  const handleClickTab = (tab: string) => () => {
    router.push(`/${tab}`);
    trackEvent({
      category: TrackingCategory.Navigation,
      action: TrackingAction.SwitchTab,
      label: `switch_tab_to_${tab}`,
      data: { [TrackingEventParameter.Tab]: tab },
      disableTrackingTool: [],
      enableAddressable: true,
    });
  };

  const output = [
    {
      onClick: handleClickTab(''),
      value: 0,
      tooltip:
        tradeABTest.isEnabled && tradeABTest.value === 'test'
          ? t('navbar.links.trade')
          : t('navbar.links.exchange'),
      icon: (
        <SwapHorizIcon
          sx={(theme) => ({
            marginRight: 0.75,
            marginBottom: `${theme.spacing(0)} !important`,
            color: (theme.vars || theme).palette.text.primary,
          })}
        />
      ),
    },
    {
      onClick: handleClickTab('gas/'),
      value: 1,
      tooltip: t('navbar.links.refuel'),
      icon: (
        <EvStationOutlinedIcon
          sx={(theme) => ({
            marginRight: 0.75,
            marginBottom: `${theme.spacing(0)} !important`,
            color: (theme.vars || theme).palette.text.primary,
          })}
        />
      ),
    },
  ];

  return output;
};
