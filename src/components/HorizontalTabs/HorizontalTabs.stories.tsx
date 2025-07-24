import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import {
  HorizontalTabItem,
  HorizontalTabs,
  HorizontalTabsProps,
} from './HorizontalTabs';
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
};

// --- Stories ---

// Interactive example with working state
const HorizontalTabsRenderer = (args: HorizontalTabsProps) => {
  const [value, setValue] = useState<string>(args.value ?? tabs[0].value);

  const onChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    args.onChange?.(event, newValue);
  };

  return (
    <HorizontalTabs
      {...args}
      tabs={args.tabs ?? tabs}
      value={value}
      onChange={onChange}
    />
  );
};

export const InteractiveWithState: Story = {
  render: (args) => <HorizontalTabsRenderer {...args} />,
  args: {
    ...baseArgs,
    tabs,
    value: tabs[0].value,
    sx: { '.MuiTab-root': { width: '160px' } },
    size: HorizontalTabSize.MD,
  },
};

export const Sizes: Story = {
  args: {
    ...baseArgs,
    tabs,
    value: tabs[0].value,
    sx: { '.MuiTab-root': { width: '160px' } },
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
    sx: { '.MuiTab-root': { width: '104px' } },
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
    sx: { '.MuiTab-root': { width: '158px' } },
  },
};

export const WithCustomStyles: Story = {
  args: {
    ...baseArgs,
    tabs,
    value: tabs[0].value,
    size: HorizontalTabSize.LG,
    sx: (theme: any) => ({
      '.MuiTab-root': { width: '160px' },
      backgroundColor: theme.palette.alphaLight100.main,
      ...(theme.applyStyles &&
        theme.applyStyles('light', {
          backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
        })),
    }),
  },
};

// Tab data
const adornmentTabs: HorizontalTabItem[] = [
  { label: 'Tab-1', value: 'tab-1', startAdornment: <PanoramaFishEyeIcon /> },
  { label: 'Tab-2', value: 'tab-2', endAdornment: <PanoramaFishEyeIcon /> },
  {
    label: 'Tab-3',
    value: 'tab-3',
    startAdornment: <PanoramaFishEyeIcon />,
    endAdornment: <PanoramaFishEyeIcon />,
  },
  { label: 'Tab-4', value: 'tab-4' },
  { value: 'tab-5' },
];

export const WithAdornmentVariants: Story = {
  args: {
    ...baseArgs,
    tabs: adornmentTabs,
    value: tabs[0].value,
    size: HorizontalTabSize.LG,
    sx: { '.MuiTab-root': { width: '160px' } },
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
    sx: { '.MuiTab-root': { width: '200px' } },
  },
};
