import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';

export const useMainSubMenuShowcases = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';

  return [
    {
      label: `${translate(`${i18Path}showcases.ukraineDonation`)}`,
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/ukraine');
      },
    },
    {
      label: `${translate(`${i18Path}showcases.klimaStaking`)}`,
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/klima-stake-v2');
      },
    },
    {
      label: `${translate(`${i18Path}showcases.carbonOffset`)}`,
      onClick: () => {
        openInNewTab('https://transferto.xyz/showcase/carbon-offset');
      },
    },
  ];
};
