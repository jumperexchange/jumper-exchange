'use client';
import { usePathname } from 'next/navigation';
import { NavbarLink, NavbarLinksContainer } from './Navbar.style';
import { AppPaths } from 'src/const/urls';
import { Theme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

const getLinkStyles = (isActive: boolean, theme: Theme) => {
  if (isActive) {
    return {
      backgroundColor: (theme.vars || theme).palette.white.main,
      boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
    };
  }

  return {
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    },
  };
};

export const NavbarLinks = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  if (!isDesktop) {
    return null;
  }

  const links = [
    { href: AppPaths.Main, label: t('navbar.links.exchange') },
    { href: AppPaths.Missions, label: t('navbar.links.missions') },
  ];

  return (
    <NavbarLinksContainer>
      {links.map(({ href, label }) => (
        <NavbarLink
          key={href}
          href={href}
          role="link"
          sx={(theme: Theme) => getLinkStyles(pathname === href, theme)}
        >
          {label}
        </NavbarLink>
      ))}
    </NavbarLinksContainer>
  );
};
