import { useMenuStore } from '@/stores/menu';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Menu } from '@/components/Menu/Menu';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
} from '@/components/Menu/Menu.style';
import { getConnectorIcon } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';
import { EVMConnectButton } from './EVMConnectButton';
import { ConnectButtonContainer } from './EcosystemSelectMenu.style';
import { SVMConnectButton } from './SVMConnectButton';

interface MenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const EcosystemSelectMenu = ({ anchorEl }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { openEcosystemSelect, setEcosystemSelectMenuState } = useMenuStore(
    (state) => state,
  );

  const handleEcoSystemSelectClose = () =>
    setEcosystemSelectMenuState(
      openEcosystemSelect.open,
      openEcosystemSelect.combinedWallet,
    );
  return (
    <Menu
      open={openEcosystemSelect.open}
      width="100%"
      styles={{
        background: theme.palette.surface1.main,
      }}
      setOpen={handleEcoSystemSelectClose}
      anchorEl={anchorEl}
    >
      <MenuHeaderAppWrapper
        sx={{
          gridColumn: 'span 3',
          marginTop: '0px !important',
        }}
      >
        <MenuHeaderAppBar component="div" elevation={0}>
          <Typography
            variant="lifiBodyMediumStrong"
            width={'auto'}
            align={'center'}
            flex={1}
            noWrap
          >
            {t('navbar.walletSelectMenu.ecosystemSelectMenu.selectEcosystem')}
          </Typography>
        </MenuHeaderAppBar>
      </MenuHeaderAppWrapper>
      <ConnectButtonContainer>
        <EVMConnectButton
          walletIcon={
            getConnectorIcon(openEcosystemSelect.combinedWallet?.evm) ||
            openEcosystemSelect.combinedWallet?.evm?.icon ||
            openEcosystemSelect.combinedWallet?.svm?.adapter.icon
          }
          evm={openEcosystemSelect.combinedWallet?.evm!}
        />
        <SVMConnectButton
          walletIcon={
            getConnectorIcon(openEcosystemSelect.combinedWallet?.evm) ||
            openEcosystemSelect.combinedWallet?.evm?.icon ||
            openEcosystemSelect.combinedWallet?.svm?.adapter.icon
          }
          svm={openEcosystemSelect.combinedWallet?.svm!}
        />
      </ConnectButtonContainer>
    </Menu>
  );
};
