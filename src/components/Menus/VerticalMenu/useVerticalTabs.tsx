import { GppGood, PrivacyTip } from '@mui/icons-material';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { type SxProps, type Theme, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';

export const useVerticalTabs = () => {
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

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
      label: t('navbar.links.exchange'),
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
