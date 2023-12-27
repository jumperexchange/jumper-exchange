import { Avatar, Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Menu, MenuHeaderAppBar, MenuHeaderAppWrapper } from 'src/components';
import { useMenuStore } from 'src/stores';
import type { Connector } from 'wagmi';
import type { Wallet } from '@solana/wallet-adapter-react';

interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}
interface EcosystemSelectButtonProps {
  type: 'evm' | 'svm';
  walletIcon?: string;
  clickHandler: () => void;
}

const EcosystemSelectButton = ({
  walletIcon,
  type,
}: EcosystemSelectButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: ' 1 0 0',
        cursor: 'pointer',
        background: theme.palette.surface2.main,
      }}
    >
      <Avatar src={walletIcon} sx={{ width: '88px', height: '88px' }} />
      <Typography variant={'lifiBodySmallStrong'} sx={{ margin: '12px' }}>
        {type === 'evm' ? 'EVM' : 'Solana'}
      </Typography>
    </Button>
  );
};

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
              sx={{
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.white.main
                    : theme.palette.black.main,
              }}
              variant={'lifiBodyMediumStrong'}
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
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '16px',
            alignSelf: 'stretch',
            background: theme.palette.surface1.main,
          }}
        >
          <EcosystemSelectButton
            type="evm"
            walletIcon={
              openEcosystemSelect.combinedWallet?.evm?.icon ||
              openEcosystemSelect.combinedWallet?.svm?.adapter.icon
            }
          />
          <EcosystemSelectButton
            type="svm"
            walletIcon={
              openEcosystemSelect.combinedWallet?.evm?.icon ||
              openEcosystemSelect.combinedWallet?.svm?.adapter.icon
            }
          />
        </Container>
      </Menu>
    )
  );
};
