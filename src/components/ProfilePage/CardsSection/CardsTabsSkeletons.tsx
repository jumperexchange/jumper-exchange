import React from 'react';
import { AchievementCardSkeleton } from 'src/components/Cards/AchievementCard/AchievementCardSkeleton';
import { PerksCardSkeleton } from 'src/components/Cards/PerksCard/PerksCardSkeleton';
import { HorizontalTabs } from 'src/components/HorizontalTabs/HorizontalTabs';

export const CardsTabsSkeletons = () => {
  const tabs = [
    {
      label: 'Achievements',
      value: 'achievements-skeletons',
    },
    {
      label: 'Perks',
      value: 'perks-skeletons',
    },
  ];

  const onChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('change', newValue);
  };

  const content = (currentValue: string) => {
    if (currentValue === 'achievements-skeletons') {
      return Array.from({ length: 8 }).map((_, index) => (
        <AchievementCardSkeleton key={index} />
      ));
    } else if (currentValue === 'perks-skeletons') {
      return Array.from({ length: 8 }).map((_, index) => (
        <PerksCardSkeleton key={index} />
      ));
    }
  };

  return (
    <HorizontalTabs
      tabs={tabs}
      onChange={onChange}
      renderContent={content}
      sx={{ width: 'fit-content' }}
    />
  );
};
