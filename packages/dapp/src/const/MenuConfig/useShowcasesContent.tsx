import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';

export const useShowcasesContent = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const { trackPageload } = useUserTracking();
  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

  return [
    {
      label: `${translate(`${i18Path}showcases.ukraineDonation`)}`,
      onClick: () => {
        const ukraineUrl = 'https://transferto.xyz/showcase/ukraine';
        openInNewTab(ukraineUrl);
        trackPageload({
          source: 'menu',
          destination: 'showcase-ukraine',
          url: ukraineUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        onCloseAllNavbarMenus();
      },
    },
    {
      label: `${translate(`${i18Path}showcases.klimaStaking`)}`,
      onClick: () => {
        const klimaStakingUrl =
          'https://transferto.xyz/showcase/klima-stake-v2';
        openInNewTab(klimaStakingUrl);
        trackPageload({
          source: 'menu',
          destination: 'showcase-klima',
          url: klimaStakingUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        onCloseAllNavbarMenus();
      },
    },
    {
      label: `${translate(`${i18Path}showcases.carbonOffset`)}`,
      onClick: () => {
        const carbonUrl = 'https://transferto.xyz/showcase/carbon-offset';
        openInNewTab(carbonUrl);
        trackPageload({
          source: 'menu',
          destination: 'showcase-carbon',
          url: carbonUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        onCloseAllNavbarMenus();
      },
    },
  ];
};
