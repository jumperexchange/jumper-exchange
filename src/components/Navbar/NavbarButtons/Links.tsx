'use client';
import { usePathname } from 'next/navigation';
import { Link } from './Links.style';
import { AppPaths } from 'src/const/urls';
import { useTranslation } from 'react-i18next';
import { Theme } from '@mui/material';
import { useMemo } from 'react';

const isPathActive = (
  currentPathname: string,
  link: string,
  subLinks?: string[],
) => {
  if (currentPathname === link) {
    return true;
  }

  return !!subLinks?.some((subLink) => subLink === currentPathname);
};

const getLinkStyles = (isActive: boolean, theme: Theme) => {
  if (isActive) {
    return {
      backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.white.main,
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
      }),
    };
  }

  return {
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
      }),
    },
  };
};

// @TODO might need to implement Tabs for nicer transition effects
export const Links = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = useMemo(
    () => [
      {
        href: AppPaths.Main,
        label: t('navbar.links.exchange'),
        subLinks: [AppPaths.Gas],
      },
      { href: AppPaths.Missions, label: t('navbar.links.missions') },
    ],
    [t],
  );

  return (
    <>
      {links.map(({ href, label, subLinks }) => {
        const isActive = isPathActive(pathname, href, subLinks);
        return (
          <Link
            key={href}
            href={href}
            role="link"
            sx={(theme: Theme) => getLinkStyles(isActive, theme)}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
};
