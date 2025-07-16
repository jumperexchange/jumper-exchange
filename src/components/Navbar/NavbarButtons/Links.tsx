'use client';

import {
  HorizontalTabItem,
  HorizontalTabs,
} from '@/components/HorizontalTabs/HorizontalTabs';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { AppPaths } from 'src/const/urls';

interface HorizontalTabLinks extends HorizontalTabItem {
  subLinks?: AppPaths[];
}

export const Links = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const tabs: HorizontalTabLinks[] = useMemo(
    () => [
      {
        value: AppPaths.Main,
        label: t('navbar.links.exchange'),
        subLinks: [AppPaths.Gas],
        // startAdornment: <PanoramaFishEyeIcon />,
        // endAdornment: <PanoramaFishEyeIcon />,
      },
      {
        value: AppPaths.Missions,
        label: t('navbar.links.missions'),
        // startAdornment: <PanoramaFishEyeIcon />,
        // endAdornment: <PanoramaFishEyeIcon />,
      },
    ],
    [t],
  );

  const activeTab = useMemo(
    () =>
      tabs.find(
        ({ value, subLinks }) =>
          pathname === value ||
          subLinks?.some((subLink) => pathname === subLink),
      ),
    [pathname, tabs],
  );

  const onChange = (_: React.SyntheticEvent, newValue: string) => {
    const tab = tabs.find(({ value }) => value === newValue);
    if (tab) {
      router.push(tab.value);
    }
  };

  const onTabClick =
    (href: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      router.push(href);
    };

  return (
    <HorizontalTabs
      tabs={tabs}
      onChange={onChange}
      value={activeTab?.value}
      onTabClick={onTabClick}
      sx={{ backgroundColor: 'transparent' }}
      size={HorizontalTabSize.LG}
    />
  );
};
