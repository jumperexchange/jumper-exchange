import { Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Menu, MenuHeaderAppBar, MenuHeaderAppWrapper } from 'src/components';
import { useMenuStore } from 'src/stores';

import { SVMConnectButton } from './SVMConnectButton';
import { EVMConnectButton } from './EVMConnectButton';
import { ConnectButtonContainer } from './EcosystemSelectMenu.style';

interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const EcosystemSelectMenu = ({ handleClose, open }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { openEcosystemSelect, onOpenEcosystemSelectMenu } = useMenuStore(
    (state) => state,
  );

  return (
    openEcosystemSelect && (
      <Menu
        handleClose={handleClose}
        open={openEcosystemSelect.open}
        width="420px"
        styles={{
          background: theme.palette.surface1.main,
        }}
        transformOrigin={'top'}
        setOpen={onOpenEcosystemSelectMenu}
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
              {/* {t('navbar.walletSelectMenu.connectWallet')} */}
              Select wallet ecosystem
            </Typography>
          </MenuHeaderAppBar>
        </MenuHeaderAppWrapper>
        <ConnectButtonContainer>
          <EVMConnectButton
            walletIcon={
              openEcosystemSelect.combinedWallet?.evm?.icon ||
              openEcosystemSelect.combinedWallet?.svm?.adapter.icon
            }
            evm={openEcosystemSelect.combinedWallet?.evm!}
          />
          <SVMConnectButton
            walletIcon={
              openEcosystemSelect.combinedWallet?.evm?.icon ||
              openEcosystemSelect.combinedWallet?.svm?.adapter.icon
            }
            svm={openEcosystemSelect.combinedWallet?.svm!}
          />
        </ConnectButtonContainer>
      </Menu>
    )
  );
};
