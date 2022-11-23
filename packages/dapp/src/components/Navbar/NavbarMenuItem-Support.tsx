import Discord from '@transferto/shared/src/atoms/icons/Discord';
import { useLocales } from '@transferto/shared/src/hooks';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { Dispatch, SetStateAction } from 'react';
import { MenuButton, MenuItem } from './Navbar.styled';
interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarMenuItemSupport = ({
  open,
  openSubMenu,
  setOpen,
}: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';

  return (
    !!open && (
      <>
        {openSubMenu == 'none' && (
          <MenuItem
            onClick={() => {
              openInNewTab('https://discord.gg/lifi');
              setOpen(false);
            }}
          >
            <MenuButton href={'https://discord.gg/lifi'}>
              <>
                <Discord
                  style={{
                    marginRight: '9.5px',
                    textTransform: 'none',
                  }}
                />
                <span>
                  <>{translate(`${i18Path}NavbarMenu.Support`)}</>
                </span>
              </>
            </MenuButton>
          </MenuItem>
        )}
      </>
    )
  );
};

export default NavbarMenuItemSupport;
