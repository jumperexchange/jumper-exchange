import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Typography } from '@mui/material';
import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { HorizontalTabItem, HorizontalTabs } from './HorizontalTabs';
import { HorizontalTabSize } from './HorizontalTabs.style';

// Tab data
const tabs: HorizontalTabItem[] = [
  { label: 'Exchange', value: 'exchange' },
  { label: 'Campaigns', value: 'campaigns' },
];

const meta = {
  title: 'Navigation/HorizontalTabs',
  component: HorizontalTabs,
  argTypes: {
    tabSx: { control: 'object' },
    size: {
      control: 'select',
      options: Object.values(HorizontalTabSize),
      defaultValue: HorizontalTabSize.MD,
      description: 'Size of the tabs - Medium (MD) or Large (LG)',
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof HorizontalTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Minimal args to satisfy TypeScript
const baseArgs = {
  tabs: [],
  value: '',
  onChange: () => {},
  onTabClick: () => () => {},
};

// --- Stories ---

// Interactive example with working state
export const InteractiveWithState: StoryFn<typeof HorizontalTabs> = () => {
  const [value, setValue] = useState<string>(tabs[0].value);

  const onChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onTabClick =
    (value: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setValue(value);
    };

  return (
    <HorizontalTabs
      tabs={tabs}
      value={value}
      onChange={onChange}
      onTabClick={onTabClick}
      tabSx={{ width: '160px' }}
      size={HorizontalTabSize.MD}
    />
  );
};

export const Sizes: Story = {
  args: {
    ...baseArgs,
    tabs,
    value: tabs[0].value,
    tabSx: { width: '160px' },
  },
};

const iconsTabData = [
  { startAdornment: <LightModeIcon />, value: 'light' },
  { startAdornment: <DarkModeIcon />, value: 'dark' },
  { startAdornment: <BrightnessAutoIcon />, value: 'auto' },
];

export const WithIcons: Story = {
  args: {
    ...baseArgs,
    tabs: iconsTabData,
    value: 'light',
    size: HorizontalTabSize.LG,
    tabSx: { width: '104px' },
  },
};

const labelTabData = [
  { label: 'Stake', value: 'stake' },
  {
    label: 'Positions',
    value: 'positions',
    endAdornment: (
      <Typography
        variant="bodyXXSmallStrong"
        sx={(theme) => ({
          padding: theme.spacing(0.5),
          backgroundColor: theme.palette.alphaLight100.main,
          borderRadius: theme.shape.buttonBorderRadius,
          ...(theme.applyStyles &&
            theme.applyStyles('light', {
              backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
            })),
        })}
      >
        label
      </Typography>
    ),
  },
];

export const WithLabels: Story = {
  args: {
    ...baseArgs,
    tabs: labelTabData,
    value: 'stake',
    tabSx: { width: '158px' },
  },
};

export const WithCustomStyles: Story = {
  args: {
    ...baseArgs,
    tabs,
    value: tabs[0].value,
    size: HorizontalTabSize.LG,
    tabSx: { width: '160px' },
    sx: (theme: any) => ({
      backgroundColor: theme.palette.alphaLight100.main,
      ...(theme.applyStyles &&
        theme.applyStyles('light', {
          backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
        })),
    }),
  },
};

export const WithSubLinks: Story = {
  args: {
    ...baseArgs,
    tabs: labelTabData,
    value: 'stake',
    size: HorizontalTabSize.LG,
    tabSx: { width: '600px' },
  },
};

const disabledTabData = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Disabled',
    value: 'disabled',
    disabled: true,
    endAdornment: (
      <Typography
        variant="bodyXXSmallStrong"
        sx={(theme) => ({
          padding: theme.spacing(0.5),
          backgroundColor: theme.palette.alphaLight100.main,
          borderRadius: theme.shape.buttonBorderRadius,
          ...(theme.applyStyles &&
            theme.applyStyles('light', {
              backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
            })),
        })}
      >
        locked
      </Typography>
    ),
  },
  {
    label: 'Also Active',
    value: 'also-active',
  },
];

export const WithDisabledItem: Story = {
  args: {
    ...baseArgs,
    tabs: disabledTabData,
    value: 'active',
    tabSx: { width: '200px' },
  },
};
