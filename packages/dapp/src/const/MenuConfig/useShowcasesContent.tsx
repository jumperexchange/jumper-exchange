import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';

export const useShowcasesContent = () => {
  const { t: translate } = useTranslation();
  const I18_PATH = 'navbar.';
  const { trackPageload } = useUserTracking();
  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

  return [
    {
      label: translate(`${I18_PATH}showcases.ukraineDonation`, 'translation'),
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/ukraine');
        trackPageload({
          source: 'menu',
          destination: 'showcase-ukraine',
          url: 'https://transferto.xyz/showcase/ukraine',
          pageload: true,
          disableTrackingTool: [EventTrackingTool.ARCx],
        });
        onCloseAllNavbarMenus();
      },
    },
    {
      label: translate(`${I18_PATH}showcases.klimaStaking`, 'translation'),
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/klima-stake-v2');
        trackPageload({
          source: 'menu',
          destination: 'showcase-klima',
          url: 'https://transferto.xyz/showcase/klima-stake-v2',
          pageload: true,
          disableTrackingTool: [EventTrackingTool.ARCx],
        });
        onCloseAllNavbarMenus();
      },
    },
    {
      label: translate(`${I18_PATH}showcases.carbonOffset`, 'translation'),
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/carbon-offset');
        trackPageload({
          source: 'menu',
          destination: 'showcase-carbon',
          url: 'https://transferto.xyz/showcase/carbon-offset',
          pageload: true,
          disableTrackingTool: [EventTrackingTool.ARCx],
        });
        onCloseAllNavbarMenus();
      },
    },
  ];
};
