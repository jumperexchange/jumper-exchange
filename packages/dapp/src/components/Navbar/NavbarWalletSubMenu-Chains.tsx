import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import { ChainsResponse, ExtendedChain } from '@lifi/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { Avatar, IconButton, Typography, useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useLocales, useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { useIsDarkMode } from '../../providers/ThemeProvider';
import { MenuHeaderAppBar, MenuItem, MenuItemLabel } from './Navbar.styled';

interface NavbarSubMenuProps {
  open: boolean;
  activeChain: ExtendedChain;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  chainInfos: ChainsResponse;
  isSuccess: boolean;
  walletManagement: any;
}

const NavbarWalletSubMenuChains = ({
  open,
  openSubMenu,
  activeChain,
  walletManagement,
  setOpenSubMenu,
  chainInfos,
  isSuccess,
}: NavbarSubMenuProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.WalletMenu.';
  const { switchChain } = walletManagement;
  const _isDarkMode = useIsDarkMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSwitchChain = (destinationChainId) => {
    switchChain(destinationChainId);
  };

  return (
    !!open && (
      <>
        {openSubMenu === 'language' && (
          <Paper
            sx={{
              background: !!_isDarkMode ? '#121212' : '#fff',
              borderRadius: '0',
              borderBottomLeftRadius: isMobile ? '0' : '12px',
              borderBottomRightRadius: isMobile ? '0' : '12px',
              maxHeight: 'calc( 100vh - 146px )',
              overflowY: 'scroll',
              '> ul': {
                padding: '16px 0',
              },
            }}
          >
            <MenuHeaderAppBar
              elevation={0}
              sx={{
                position: 'absolute',
                zIndex: 1,
                top: 0,
              }}
            >
              <IconButton
                size="medium"
                aria-label="settings"
                edge="start"
                className="menu-header__icon"
                sx={{
                  color: theme.palette.text.primary,
                  position: 'absolute',
                  marginLeft: '6px',
                }}
                onClick={() => {
                  setOpenSubMenu('none');
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                fontSize={'14px'}
                lineHeight={'20px'}
                width={'100%'}
                align={'center'}
                fontWeight="700"
                flex={1}
                noWrap
              >
                <>{translate(`${i18Path}Chains`)}</>
              </Typography>
            </MenuHeaderAppBar>

            {!!isSuccess ? (
              chainInfos?.chains.map((el: ExtendedChain, index: number) => (
                <MenuItem
                  key={`chain-${el.id}`}
                  onClick={() => {
                    handleSwitchChain(el.id);
                  }}
                >
                  <MenuItemLabel>
                    <>
                      <Avatar
                        className="menu-item-label__icon"
                        src={el.logoURI}
                        alt={`${el.name}-chain-logo`}
                        sx={{ height: '24px', width: '24px' }}
                      />
                      <Typography
                        fontSize={'14px'}
                        lineHeight={'20px'}
                        ml={'12px'}
                      >
                        <>{el.name}</>
                      </Typography>
                    </>
                  </MenuItemLabel>
                  {el.id === activeChain?.id && <CheckIcon />}
                </MenuItem>
              ))
            ) : (
              <CircularProgress
                sx={{
                  width: '40px',
                  height: '40px',
                  left: 'calc( 50% - 20px )',
                  top: 'calc( 50% - 20px )',
                  position: 'absolute',
                }}
              />
            )}
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarWalletSubMenuChains;
