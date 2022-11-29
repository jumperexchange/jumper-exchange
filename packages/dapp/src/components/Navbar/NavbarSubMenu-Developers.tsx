import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarLinks} from './NavbarLinks'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocales } from '@transferto/shared/src/hooks';
import { useIsDarkMode } from '../../providers/ThemeProvider';
import { MenuHeaderAppBar, MenuItemLabel, MenuLinkItem } from './Navbar.styled';

interface NavbarSubMenuProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
}

const NavbarSubMenuDevelopers = ({
  open,
  openSubMenu,
  setOpenSubMenu,
}: NavbarSubMenuProps) => {
  const { translate } = useLocales();
  const i18Path = 'Navbar.';
  const theme = useTheme();
  const _isDarkMode = useIsDarkMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    !!open && (
      <>
        {openSubMenu === 'devs' && (
          <Paper
            sx={{
              background: !!_isDarkMode ? '#121212' : theme.palette.grey[100],
              borderRadius: isMobile ? '0' : '12px',
              '> ul': {
                padding: '16px 0',
              },
              paddingBottom: '12px',
            }}
          >
            <MenuHeaderAppBar elevation={0}>
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
                <>{translate(`${i18Path}NavbarMenu.Developers`)}</>
              </Typography>
            </MenuHeaderAppBar>
            <MenuLinkItem
              href={'https://github.com/lifinance/'}
              target="_blank"
              rel="noreferrer"
            >
              <MenuItemLabel>
                <>
                  <GitHubIcon
                    sx={{
                      color: !!_isDarkMode
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    }}
                  />
                  <Typography
                    fontSize={'14px'}
                    fontWeight={500}
                    lineHeight={'20px'}
                    ml={'12px'}
                  >
                    <>{translate(`${i18Path}Developers.Github`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
            </MenuLinkItem>
            <MenuLinkItem href={'https://docs.li.fi/'} target="_blank">
              <MenuItemLabel>
                <>
                  <DescriptionOutlinedIcon />
                  <Typography
                    fontSize={'14px'}
                    fontWeight={500}
                    lineHeight={'20px'}
                    ml={'12px'}
                  >
                    <>{translate(`${i18Path}Developers.Documentation`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
            </MenuLinkItem>
            <MenuLinkItem href={'#'} target="_blank">
              <MenuItemLabel>
                <>
                  <SlideshowIcon />
                  <Typography
                    fontSize={'14px'}
                    fontWeight={500}
                    lineHeight={'20px'}
                    ml={'12px'}
                  >
                    <>{translate(`${i18Path}Developers.Showcases`)}</>
                  </Typography>
                </>
              </MenuItemLabel>
            </MenuLinkItem>
          </Paper>
        )}
      </>
    )
  );
};

export default NavbarSubMenuDevelopers;
