import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';

export const useShowcasesContent = () => {
  const { t } = useTranslation();
  const { trackPageload } = useUserTracking();
  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

  return [
    {
      label: t('navbar.showcases.ukraineDonation'),
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
      label: t('navbar.showcases.klimaStaking'),
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
      label: t('navbar.showcases.carbonOffset'),
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
