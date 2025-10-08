import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { MultiSelectOption } from './MultiSelect.types';

const meta = {
  title: 'Components/Core/MultiSelect',
  component: MultiSelect,
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
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: MultiSelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
  { value: 'option6', label: 'Option 6' },
];

const optionsWithIcons: MultiSelectOption[] = [
  { value: 'person', label: 'Individual', icon: <PersonIcon /> },
  { value: 'group', label: 'Team', icon: <GroupIcon /> },
  { value: 'work', label: 'Professional', icon: <WorkIcon /> },
  { value: 'school', label: 'Educational', icon: <SchoolIcon /> },
];

const groupedOptions: MultiSelectOption[] = [
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
  { value: 'japan', label: 'Japan' },
  { value: 'china', label: 'China' },
  { value: 'india', label: 'India' },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select multiple options',
    label: 'Choose Options',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
    show: 'chips',
  },
};

export const WithSelectedValues: Story = {
  args: {
    options: basicOptions,
    value: ['option1', 'option3'],
    label: 'Pre-selected Options',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
    show: 'chips',
  },
};

export const WithIcons: Story = {
  args: {
    options: optionsWithIcons,
    placeholder: 'Select categories',
    label: 'Categories',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
    show: 'chips',
  },
};

export const GroupedOptions: Story = {
  args: {
    options: groupedOptions,
    placeholder: 'Select countries',
    label: 'Countries',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
    show: 'chips',
  },
};

export const WithoutCheckboxes: Story = {
  args: {
    options: basicOptions,
    label: 'No Checkboxes',
    show: 'chips',
    size: 'medium',
    variant: 'outlined',
  },
};

export const WithoutChips: Story = {
  args: {
    options: basicOptions,
    label: 'No Chips Display',
    show: 'chips',
    size: 'medium',
    variant: 'outlined',
  },
};

export const LimitedChips: Story = {
  args: {
    options: basicOptions,
    value: ['option1', 'option2', 'option3', 'option4', 'option5'],
    label: 'Max 2 Chips',
    maxChips: 2,
    show: 'chips',
    size: 'medium',
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    value: ['option1', 'option2'],
    label: 'Disabled MultiSelect',
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
    helperText: 'Please select at least one option',
    fullWidth: false,
    size: 'medium',
    variant: 'outlined',
  },
};

export const FullWidth: Story = {
  args: {
    options: basicOptions,
    label: 'Full Width MultiSelect',
    fullWidth: true,
    size: 'medium',
    variant: 'outlined',
  },
};

export const Small: Story = {
  args: {
    options: basicOptions,
    label: 'Small MultiSelect',
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

export const InteractiveExample: Story = {
  args: {
    options: groupedOptions,
    value: [],
    label: 'Interactive Country Selector',
    placeholder: 'Choose countries',
    show: 'chips',
    maxChips: 3,
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(
      (args.value as string[]) || [],
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <MultiSelect
          {...args}
          value={selected}
          onChange={setSelected}
          helperText={`Selected: ${selected.length} countries`}
        />
        <div>
          <strong>Selected values:</strong> {selected.join(', ') || 'None'}
        </div>
      </div>
    );
  },
};
