import type { Breakpoint, CSSObject } from '@mui/material';
import { Typography, darken } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Menu, MenuHeaderAppBar, MenuHeaderAppWrapper } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';

interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const EcosystemSelectMenu = ({ handleClose, open }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [
    openEcosystemSelect,
    onOpenEcosystemSelect,
    openSubMenu,
    onOpenSubMenu,
  ] = useMenuStore((state) => [
    state.openEcosystemSelect,
    state.onOpenEcosystemSelect,
    state.openSubMenu,
    state.onOpenSubMenu,
  ]);

  return (
    openEcosystemSelect && (
      <Menu
        handleClose={handleClose}
        open={openEcosystemSelect}
        width="420px"
        styles={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          justifyItems: 'center',
          ul: {
            gridColumnStart: 1,
            gridColumnEnd: 3,
          },
        }}
        transformOrigin={'top'}
        setOpen={onOpenEcosystemSelect}
        isOpenSubMenu={openSubMenu !== MenuKeys.None}
      >
        {openSubMenu === MenuKeys.None && (
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
                {t('navbar.walletSelectMenu.connectWallet')}
              </Typography>
            </MenuHeaderAppBar>
          </MenuHeaderAppWrapper>
        )}
        Extra Menu
      </Menu>
    )
  );
};
