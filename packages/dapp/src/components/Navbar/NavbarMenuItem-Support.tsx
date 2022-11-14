import Discord from '@transferto/shared/src/atoms/icons/Discord';
import { useLocales } from '@transferto/shared/src/hooks';
import { MenuButton } from './Navbar.styled';

interface NavbarMenuItemProps {
  open: boolean;
  openSubMenu: string;
}

const NavbarMenuItemSupport = ({ open, openSubMenu }: NavbarMenuItemProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';

  return (
    !!open && (
      <>
        {openSubMenu == 'none' && (
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
        )}
      </>
    )
  );
};

export default NavbarMenuItemSupport;
