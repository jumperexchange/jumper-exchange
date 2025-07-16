import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { HorizontalTabItem, HorizontalTabs } from './HorizontalTabs';
import { HorizontalTabSize } from './HorizontalTabs.style';

// Tab data
const tabs: HorizontalTabItem[] = [
  {
    label: 'Tab 1',
    value: 'tab1',
  },
  {
    label: 'Tab 2',
    value: 'tab2',
  },
  {
    label: 'Tab 3',
    value: 'tab3',
  },
];

const tabsWithIcons: HorizontalTabItem[] = [
  {
    label: 'Tab 1',
    value: 'tab1',
    startAdornment: (
      <Box
        component="span"
        sx={{
          width: 24,
          height: 24,
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          display: 'inline-block',
        }}
      />
    ),
  },
  {
    label: 'Tab 2',
    value: 'tab2',
    startAdornment: (
      <Box
        component="span"
        sx={{
          width: 24,
          height: 24,
          backgroundColor: 'secondary.main',
          borderRadius: '50%',
          display: 'inline-block',
        }}
      />
    ),
  },
];

export const TabsExample = () => {
  // Regular tabs state
  const [regularValue, setRegularValue] = useState<string>(tabs[0].value);
  const [iconValue, setIconValue] = useState<string>(tabsWithIcons[0].value);

  const handleRegularChange = (_: React.SyntheticEvent, newValue: string) => {
    setRegularValue(newValue);
  };

  const handleRegularTabClick =
    (value: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setRegularValue(value);
    };

  const handleIconChange = (_: React.SyntheticEvent, newValue: string) => {
    setIconValue(newValue);
  };

  const handleIconTabClick =
    (value: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIconValue(value);
    };

  return (
    <Box sx={{ p: 4, backgroundColor: '#F5F5F5' }}>
      <Stack spacing={8}>
        {/* Regular Tabs */}
        <Stack spacing={4}>
          <Box>
            <Box sx={{ mb: 2, color: 'text.secondary' }}>Medium</Box>
            <HorizontalTabs
              tabs={tabs}
              value={regularValue}
              onChange={handleRegularChange}
              onTabClick={handleRegularTabClick}
              size={HorizontalTabSize.MD}
            />
          </Box>
          <Box>
            <Box sx={{ mb: 2, color: 'text.secondary' }}>Large</Box>
            <HorizontalTabs
              tabs={tabs}
              value={regularValue}
              onChange={handleRegularChange}
              onTabClick={handleRegularTabClick}
              size={HorizontalTabSize.LG}
            />
          </Box>
        </Stack>

        {/* Tabs with Icons */}
        <Stack spacing={4}>
          <Box>
            <Box sx={{ mb: 2, color: 'text.secondary' }}>Medium with Icons</Box>
            <HorizontalTabs
              tabs={tabsWithIcons}
              value={iconValue}
              onChange={handleIconChange}
              onTabClick={handleIconTabClick}
              size={HorizontalTabSize.MD}
            />
          </Box>
          <Box>
            <Box sx={{ mb: 2, color: 'text.secondary' }}>Large with Icons</Box>
            <HorizontalTabs
              tabs={tabsWithIcons}
              value={iconValue}
              onChange={handleIconChange}
              onTabClick={handleIconTabClick}
              size={HorizontalTabSize.LG}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};
