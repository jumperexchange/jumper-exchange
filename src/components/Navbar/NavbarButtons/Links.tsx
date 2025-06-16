'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppPaths } from 'src/const/urls';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  HorizontalTabsContainer,
  HorizontalTab,
} from 'src/components/Tabs/Tabs.style';

export const Links = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      {
        href: AppPaths.Main,
        label: t('navbar.links.exchange'),
        subLinks: [AppPaths.Gas],
      },
      {
        href: AppPaths.Missions,
        label: t('navbar.links.missions'),
      },
    ],
    [t],
  );

  const activeTab = useMemo(
    () =>
      tabs.find(
        ({ href, subLinks }) =>
          pathname === href ||
          subLinks?.some((subLink) => pathname === subLink),
      ),
    [pathname, tabs],
  );

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  return (
    <HorizontalTabsContainer value={activeTab?.href} onChange={handleChange}>
      {tabs.map(({ href, label }) => (
        <HorizontalTab key={href} value={href} label={label} disableRipple />
      ))}
    </HorizontalTabsContainer>
  );
};
