import React, { useContext } from 'react';
import { HorizontalTabs } from 'src/components/HorizontalTabs/HorizontalTabs';
import { ProfileContext } from 'src/providers/ProfileProvider';

export const CardsTabs = () => {
  const { walletAddress } = useContext(ProfileContext); // @todo: use for pda
  const tabs = [
    {
      label: 'Achievements',
      value: 'achievements',
    },
    {
      label: 'Perks',
      value: 'perks',
    },
  ];

  const onChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('change', newValue);
  };

  const content = (currentValue: string) => {
    if (currentValue === 'achievements') {
      return <p> Achievements</p>;
    } else if (currentValue === 'perks') {
      return <p>perks</p>;
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
