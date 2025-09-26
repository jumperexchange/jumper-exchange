import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TabSelect } from './TabSelect';
import { TabOption } from './TabSelect.types';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const meta = {
  title: 'Components/Core/TabSelect',
  component: TabSelect,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: { type: 'select' },
      options: ['standard', 'scrollable', 'fullWidth'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    indicatorColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    textColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'inherit'],
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['start', 'end', 'top', 'bottom'],
    },
    scrollButtons: {
      control: { type: 'select' },
      options: ['auto', true, false],
    },
  },
} satisfies Meta<typeof TabSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: TabOption[] = [
  { value: 'tab1', label: 'Tab One' },
  { value: 'tab2', label: 'Tab Two' },
  { value: 'tab3', label: 'Tab Three' },
  { value: 'tab4', label: 'Tab Four', disabled: true },
];

const optionsWithIcons: TabOption[] = [
  { value: 'home', label: 'Home', icon: <HomeIcon /> },
  { value: 'profile', label: 'Profile', icon: <PersonIcon /> },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  { value: 'notifications', label: 'Alerts', icon: <NotificationsIcon /> },
];

const optionsWithBadges: TabOption[] = [
  { value: 'messages', label: 'Messages', badge: 5 },
  { value: 'notifications', label: 'Notifications', badge: 12 },
  { value: 'updates', label: 'Updates', badge: 'New' },
  { value: 'alerts', label: 'Alerts' },
];

const manyOptions: TabOption[] = [
  { value: 'tab1', label: 'Dashboard', icon: <HomeIcon /> },
  { value: 'tab2', label: 'Profile', icon: <PersonIcon /> },
  { value: 'tab3', label: 'Settings', icon: <SettingsIcon /> },
  {
    value: 'tab4',
    label: 'Notifications',
    icon: <NotificationsIcon />,
    badge: 3,
  },
  { value: 'tab5', label: 'Favorites', icon: <FavoriteIcon /> },
  { value: 'tab6', label: 'Starred', icon: <StarIcon />, badge: 7 },
  { value: 'tab7', label: 'Cart', icon: <ShoppingCartIcon />, badge: 2 },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    value: 'tab1',
    orientation: 'horizontal',
    variant: 'standard',
    size: 'medium',
    showBorder: false,
  },
};

export const WithIcons: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    orientation: 'horizontal',
    variant: 'standard',
    size: 'medium',
    iconPosition: 'start',
    showBorder: false,
  },
};

export const IconsOnTop: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    orientation: 'horizontal',
    variant: 'standard',
    size: 'medium',
    iconPosition: 'top',
    showBorder: false,
  },
};

export const WithBadges: Story = {
  args: {
    options: optionsWithBadges,
    value: 'messages',
    orientation: 'horizontal',
    variant: 'standard',
    size: 'medium',
    showBorder: false,
  },
};

export const Scrollable: Story = {
  args: {
    options: manyOptions,
    value: 'tab1',
    orientation: 'horizontal',
    variant: 'scrollable',
    scrollButtons: 'auto',
    size: 'medium',
    showBorder: false,
  },
};

export const FullWidth: Story = {
  args: {
    options: basicOptions.slice(0, 3),
    value: 'tab1',
    variant: 'fullWidth',
    size: 'medium',
    showBorder: false,
  },
};

export const Centered: Story = {
  args: {
    options: basicOptions.slice(0, 3),
    value: 'tab1',
    centered: true,
    variant: 'standard',
    size: 'medium',
    showBorder: false,
  },
};

export const Vertical: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    orientation: 'vertical',
    variant: 'standard',
    size: 'medium',
    showBorder: true,
  },
};

export const WithBorder: Story = {
  args: {
    options: basicOptions,
    value: 'tab1',
    showBorder: true,
    size: 'medium',
    variant: 'standard',
  },
};

export const Small: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    size: 'small',
    variant: 'standard',
    iconPosition: 'start',
  },
};

export const Large: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    size: 'large',
    variant: 'standard',
    iconPosition: 'start',
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    value: 'tab1',
    disabled: true,
    size: 'medium',
    variant: 'standard',
  },
};

export const SecondaryColor: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    indicatorColor: 'secondary',
    textColor: 'secondary',
    size: 'medium',
    variant: 'standard',
  },
};

export const InteractiveExample: Story = {
  args: {
    options: optionsWithIcons,
    value: 'home',
    showBorder: true,
    iconPosition: 'start',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value as string);
    const [content, setContent] = useState('Welcome to the Home page!');

    const handleChange = (newValue: string) => {
      setValue(newValue);
      const contents: Record<string, string> = {
        home: 'Welcome to the Home page!',
        profile: 'This is your Profile section.',
        settings: 'Manage your Settings here.',
        notifications: 'Check your latest Notifications.',
      };
      setContent(contents[newValue] || '');
    };

    return (
      <div style={{ width: '100%' }}>
        <TabSelect {...args} value={value} onChange={handleChange} />
        <div
          style={{
            padding: '20px',
            marginTop: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <h3>Tab Content</h3>
          <p>{content}</p>
        </div>
      </div>
    );
  },
};

export const ComplexExample: Story = {
  args: {
    options: manyOptions,
    value: 'tab1',
    variant: 'scrollable',
    scrollButtons: 'auto',
    showBorder: true,
    iconPosition: 'start',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value as string);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3>Standard Tabs with Icons and Badges</h3>
          <TabSelect {...args} value={value} onChange={setValue} />
        </div>

        <div>
          <h3>Full Width Tabs</h3>
          <TabSelect
            options={manyOptions.slice(0, 3)}
            value={value}
            onChange={setValue}
            variant="fullWidth"
            showBorder={true}
          />
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ width: '200px' }}>
            <h3>Vertical Tabs</h3>
            <TabSelect
              options={manyOptions.slice(0, 4)}
              value={value}
              onChange={setValue}
              orientation="vertical"
              showBorder={false}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          >
            <h3>Content Area</h3>
            <p>Selected tab: {value}</p>
          </div>
        </div>
      </div>
    );
  },
};
