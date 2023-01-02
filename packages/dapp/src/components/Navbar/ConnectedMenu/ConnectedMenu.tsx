import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { ConnectedMenuItems, ConnectedSubMenuChains } from '../../../const';
import { useMenu } from '../../../providers/MenuProvider';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../index';

interface NavbarMenuProps {
  anchorRef: any; // TODO: Replace this any with the correct type
  handleClose: (event: MouseEvent | TouchEvent) => void;
  isSuccess: boolean;
}
const ConnectedMenu = ({ handleClose, anchorRef }: NavbarMenuProps) => {
  const i18Path = 'Navbar.WalletMenu.';
  const { t: translate } = useTranslation();
  const settings = useSettings();
  const theme = useTheme();
  const menu = useMenu();
  const _connectedMenuItems = ConnectedMenuItems();
  const _connectedSubMenuChains = ConnectedSubMenuChains();

  return !!menu.openNavbarConnectedMenu ? ( //todo, ON ???
    <NavbarMenu
      handleClose={handleClose}
      anchorRef={anchorRef}
      bgColor={theme.palette.surface2.main}
      open={menu.openNavbarConnectedMenu}
      isScrollable={menu.openNavbarSubMenu === 'chains'}
      setOpen={menu.onOpenNavbarConnectedMenu}
      openSubMenu={menu.openNavbarSubMenu}
    >
      {_connectedMenuItems.map((el, index) => (
        <MenuItemComponent
          key={`${el.label}-${index}`}
          label={el.label}
          listIcon={el.listIcon}
          textColor={el.textColor}
          bgColor={el.bgColor}
          triggerSubMenu={el.triggerSubMenu}
          showButton={el.showButton}
          extraIcon={el.extraIcon}
          onClick={el.onClick}
          open={menu.openNavbarConnectedMenu}
          openSubMenu={menu.openNavbarSubMenu}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
        />
      ))}

      <SubMenuComponent
        label={`${translate(`${i18Path}Chains`)}`}
        isSubMenu={true}
        isScrollable={true}
        bgColor={theme.palette.surface2.main}
        triggerSubMenu={'chains'}
        open={menu.openNavbarConnectedMenu}
        openSubMenu={menu.openNavbarSubMenu}
        setOpenSubMenu={menu.onOpenNavbarSubMenu}
        subMenuList={_connectedSubMenuChains}
      />
    </NavbarMenu>
  ) : null;
};

export default ConnectedMenu;
