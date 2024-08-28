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
import type { Connector } from 'wagmi';
import { EVMConnectButton } from './EVMConnectButton';
import { ConnectButtonContainer } from './EcosystemSelectMenu.style';
import { SVMConnectButton } from './SVMConnectButton';
import { Box } from '@mui/system';

interface MenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const EcosystemSelectMenu = ({ anchorEl }: MenuProps) => {
  const { t } = useTranslation();
  const { openEcosystemSelect } = useMenuStore((state) => state);

  return (
    <>
      <MenuHeaderAppWrapper
        sx={{
          gridColumn: 'span 3',
          marginTop: '0px !important',
        }}
      >
        <MenuHeaderAppBar component="div" elevation={0}>
          <Typography
            variant="bodyMediumStrong"
            width={'auto'}
            align={'center'}
            flex={1}
            noWrap
          >
            {t('navbar.walletSelectMenu.ecosystemSelectMenu.selectEcosystem')}
          </Typography>
        </MenuHeaderAppBar>
      </MenuHeaderAppWrapper>
      <ConnectButtonContainer as="li">
        <EVMConnectButton
          walletIcon={getConnectorIcon(
            openEcosystemSelect.combinedWallet?.evm as Connector,
          )}
          evm={openEcosystemSelect.combinedWallet?.evm!}
        />
      </ConnectButtonContainer>
      <ConnectButtonContainer as="li">
        <SVMConnectButton
          walletIcon={getConnectorIcon(
            (openEcosystemSelect.combinedWallet?.evm as Connector) ||
              openEcosystemSelect.combinedWallet?.svm?.adapter,
          )}
          svm={openEcosystemSelect.combinedWallet?.svm!}
        />
      </ConnectButtonContainer>
      <Box
        sx={{
          gridColumn: 'span 3',
          marginBottom: '10px',
        }}
      />
    </>
  );
};
