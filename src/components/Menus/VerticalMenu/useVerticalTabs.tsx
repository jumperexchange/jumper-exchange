import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
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

  const handleClickTab = (tab: string) => () => {
    const searchParams = new URLSearchParams(window.location.search);
    let path = searchParams.toString();
    path = path.startsWith('?') ? path.substring(1) : path;

    router.push(`/${tab}?${path}`);
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
      tooltip: t('navbar.links.exchange'),
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
      onClick: handleClickTab('gas/'),
      value: 1,
      tooltip: t('navbar.links.refuel'),
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
  ];

  return output;
};
