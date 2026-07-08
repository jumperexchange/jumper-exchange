import { useAccount } from '@lifi/wallet-management';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CandlestickChartIcon } from '@/components/illustrations/CandlestickChartIcon';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';

export const useVerticalTabs = () => {
  const { trackEvent } = useUserTracking();
  const router = useRouter();
  const { t } = useTranslation();
  const { account } = useAccount();

  const handleClickTab = (path: string, label: string) => () => {
    router.push(`/${path}`);
    trackEvent({
      category: TrackingCategory.Navigation,
      action: TrackingAction.SwitchTab,
      label: `switch_tab_to_${label}`,
      data: { [TrackingEventParameter.Tab]: label },
      disableTrackingTool: [],
      enableAddressable: true,
    });
  };

  const tabs = [
    {
      path: '',
      label: 'simple',
      displayLabel: t('navbar.links.simple'),
      icon: SwapHorizIcon,
    },
    {
      path: 'advanced/',
      label: 'advanced',
      displayLabel: t('navbar.links.advanced'),
      icon: CandlestickChartIcon,
    },
  ];

  return tabs.map(({ path, label, displayLabel, icon: Icon }, index) => ({
    onClick: handleClickTab(path, label),
    value: index,
    tooltip: displayLabel,
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
};
