import { GppGood, PrivacyTip } from '@mui/icons-material';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { type SxProps, type Theme, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AB_TEST_NAME } from '@/const/abtests';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useABTest } from '@/hooks/useABTest';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useAccount } from '@lifi/wallet-management';

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

  const tabs = [
    {
      tab: '',
      label:
        tradeABTest.isEnabled && tradeABTest.value === 'test'
          ? t('navbar.links.trade')
          : t('navbar.links.exchange'),
      icon: SwapHorizIcon,
    },
    {
      tab: 'gas/',
      label: t('navbar.links.refuel'),
      icon: EvStationOutlinedIcon,
    },
    {
      tab: 'private/',
      label: t('navbar.links.private'),
      icon: GppGood,
    },
  ];

  const output = tabs.map(({ tab, label, icon: Icon }, index) => ({
    onClick: handleClickTab(tab),
    value: index,
    tooltip: label,
    icon: (
      <Icon
        sx={(theme) => ({
          marginRight: 0.75,
          marginBottom: `${theme.spacing(0)} !important`,
          color: (theme.vars || theme).palette.text.primary,
        })}
      />
    ),
  }));

  return output;
};
