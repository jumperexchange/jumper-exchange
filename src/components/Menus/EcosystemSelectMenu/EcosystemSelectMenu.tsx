import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Menu, MenuHeaderAppBar, MenuHeaderAppWrapper } from 'src/components';
import { useMenuStore } from 'src/stores';

import { getConnectorIcon } from '@lifi/wallet-management';
import { EVMConnectButton } from './EVMConnectButton';
import { SVMConnectButtonContainer as ConnectButtonContainer } from './EcosystemSelectMenu.style';
import { SVMConnectButton } from './SVMConnectButton';

interface MenuProps {
  anchorEl: any;
}

export const EcosystemSelectMenu = ({ anchorEl }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { openEcosystemSelect, setEcosystemSelectMenuState } = useMenuStore(
    (state) => state,
  );

  return (
    <Menu
      open={openEcosystemSelect.open}
      width="420px"
      styles={{
        background: theme.palette.surface1.main,
      }}
      setOpen={setEcosystemSelectMenuState}
      anchorEl={anchorEl}
    >
      <MenuHeaderAppWrapper
        sx={{
          gridColumn: 'span 3',
          marginBottom: '-12px',
        }}
      >
        <MenuHeaderAppBar component="div" elevation={0}>
          <Typography
            variant="lifiBodyMediumStrong"
            width={'100%'}
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
