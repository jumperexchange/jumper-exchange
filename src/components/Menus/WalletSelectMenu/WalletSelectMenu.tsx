import { Menu } from '@/components/Menu/Menu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import type { Breakpoint, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WalletSelectMenuContent from '@/components/Menus/WalletSelectMenu/WalletSelectMenuContent';

interface MenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const WalletSelectMenu = ({ anchorEl }: MenuProps) => {
  const theme = useTheme();
  const {
    isPopper,
    openWalletSelectMenu,
    setWalletSelectMenuState,
    openSubMenu,
  } = useMenuStore((state) => state);

  return (
    <Menu
      open={openWalletSelectMenu && isPopper}
      cardsLayout={openSubMenu === MenuKeysEnum.WalletSelectMore ? false : true}
      styles={{
        display: 'grid',
        gridTemplateColumns:
          openSubMenu === MenuKeysEnum.EcosystemSelect
            ? '1fr 1fr'
            : '1fr 1fr 1fr',
        justifyItems: 'center',
        ul: {
          gridColumnStart: 1,
          gridColumnEnd: openSubMenu === MenuKeysEnum.EcosystemSelect ? 3 : 4,
        },
      }}
      setOpen={(open: boolean) => setWalletSelectMenuState(open)}
      isOpenSubMenu={openSubMenu === MenuKeysEnum.WalletSelectMore}
      anchorEl={anchorEl}
    >
      <WalletSelectMenuContent
        openWalletSelectMenu={openWalletSelectMenu && isPopper}
        showAllButton
      />
    </Menu>
  );
};
