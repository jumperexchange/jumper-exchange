import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { EventTrackingTools } from '../../../hooks';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';

export const useMainSubMenuShowcases = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const { trackPageload } = useUserTracking();

  return [
    {
      label: `${translate(`${i18Path}showcases.ukraineDonation`)}`,
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/ukraine');
        trackPageload({
          source: 'menu',
          destination: 'showcase-ukraine',
          url: 'https://transferto.xyz/showcase/ukraine',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
    {
      label: `${translate(`${i18Path}showcases.klimaStaking`)}`,
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/klima-stake-v2');
        trackPageload({
          source: 'menu',
          destination: 'showcase-klima',
          url: 'https://transferto.xyz/showcase/klima-stake-v2',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
    {
      label: `${translate(`${i18Path}showcases.carbonOffset`)}`,
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/carbon-offset');
        trackPageload({
          source: 'menu',
          destination: 'showcase-carbon',
          url: 'https://transferto.xyz/showcase/carbon-offset',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
  ];
};
