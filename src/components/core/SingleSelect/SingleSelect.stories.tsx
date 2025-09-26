import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SingleSelect } from './SingleSelect';
import { SingleSelectOption } from './SingleSelect.types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

const meta = {
  title: 'Components/Core/SingleSelect',
  component: SingleSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: ['outlined', 'filled', 'standard'],
    },
  },
} satisfies Meta<typeof SingleSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: SingleSelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true },
];

const optionsWithIcons: SingleSelectOption[] = [
  { value: 'home', label: 'Home', icon: <HomeIcon /> },
  { value: 'profile', label: 'Profile', icon: <AccountCircleIcon /> },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select an option',
    label: 'Choose Option',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
  },
};

export const WithValue: Story = {
  args: {
    options: basicOptions,
    value: 'option2',
    label: 'Selected Option',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
  },
};

export const WithIcons: Story = {
  args: {
    options: optionsWithIcons,
    placeholder: 'Select a page',
    label: 'Navigation',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    value: 'option1',
    label: 'Disabled Select',
    disabled: true,
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
  },
};

export const WithError: Story = {
  args: {
    options: basicOptions,
    label: 'Select with Error',
    error: true,
    helperText: 'This field is required',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
  },
};

export const FullWidth: Story = {
  args: {
    options: basicOptions,
    label: 'Full Width Select',
    fullWidth: true,
    size: 'medium',
    variant: 'outlined',
  },
};

export const Small: Story = {
  args: {
    options: basicOptions,
    label: 'Small Select',
    size: 'small',
    variant: 'outlined',
  },
};

export const Filled: Story = {
  args: {
    options: basicOptions,
    label: 'Filled Variant',
    variant: 'filled',
    size: 'medium',
  },
};

export const Standard: Story = {
  args: {
    options: basicOptions,
    label: 'Standard Variant',
    variant: 'standard',
    size: 'medium',
  },
};

export const Required: Story = {
  args: {
    options: basicOptions,
    label: 'Required Field',
    required: true,
    helperText: 'This field is mandatory',
    size: 'medium',
    variant: 'outlined',
  },
};
