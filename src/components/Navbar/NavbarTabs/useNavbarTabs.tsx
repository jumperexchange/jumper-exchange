import CreditCardIcon from '@mui/icons-material/CreditCard';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking, useEventCollector } from 'src/hooks';
import { EventTrackingTool } from 'src/types';

interface useNavbarTabsProps {
  navbarPageReload?: boolean;
}

export const useNavbarTabs = ({ navbarPageReload }: useNavbarTabsProps) => {
  const { trackEvent } = useUserTracking();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { collectEvent } = useEventCollector();

  const handleClickTab =
    (tab: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      window.history.replaceState(null, document.title, `/${tab}`);
      if (navbarPageReload) {
        navigate(`/${tab}`);
      }

      const commonTrackingProps = {
        category: TrackingCategory.Navigation,
        label: `switch_tab_to_${tab}`,
        data: { [TrackingEventParameter.Tab]: tab },
      };

      collectEvent({
        name: TrackingAction.SwitchTab,
        params: commonTrackingProps,
      });

      trackEvent({
        action: TrackingAction.SwitchTab,
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
        ...commonTrackingProps,
      });
    };

  const output = [
    {
      label: t('navbar.links.exchange'),
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
      onClick: handleClickTab('exchange'),
    },
    {
      label: t('navbar.links.refuel'),
      onClick: handleClickTab('refuel'),
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
      onClick: handleClickTab('buy'),
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
      disabled: import.meta.env.VITE_ONRAMPER_ENABLED !== 'true',
    },
  ];

  return output;
};
