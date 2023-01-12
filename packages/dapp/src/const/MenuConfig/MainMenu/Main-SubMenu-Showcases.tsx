import { useTheme } from '@mui/material/styles';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { MenuListItem } from '../../../types';

const MainSubMenuShowcases = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const _MainSubMenuShowcases: MenuListItem[] = [
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

  return _MainSubMenuShowcases;
};

export default MainSubMenuShowcases;
