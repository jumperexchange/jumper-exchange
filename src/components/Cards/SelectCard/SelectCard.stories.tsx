import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SelectCard } from './SelectCard';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { SelectCardMode } from './SelectCard.styles';
import { useState } from 'react';
import { SelectCardInputProps } from './SelectCard.types';

const meta = {
  title: 'Components/Cards/Select cards',
  component: SelectCard,
  tags: ['autodocs'],
} satisfies Meta<typeof SelectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    label: 'To',
    icon: <AvatarBadge avatarSize={40} alt="ETH" />,
    placeholder: 'Select token',
    mode: SelectCardMode.Display,
    onClick: () => {
      console.log('Component clickable');
    },
  },
};

export const Display: Story = {
  args: {
    label: 'To',
    icon: <AvatarBadge avatarSize={40} alt="ETH" />,
    value: 'ETH',
    description: 'Arbitrum',
    placeholder: 'Select token',
    mode: SelectCardMode.Display,
    onClick: () => {
      console.log('Component clickable');
    },
  },
};

export const Interactive: Story = {
  render: (args) => {
    if (args.mode !== SelectCardMode.Input) return <></>;

    const inputArgs = args as SelectCardInputProps;
    const [value, setValue] = useState(inputArgs.value || '');

    return (
      <SelectCard
        {...inputArgs}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    id: 'username',
    label: 'Username',
    mode: SelectCardMode.Input,
    value: 'x.com/username',
    placeholder: 'eg. x.com/username',
  },
};

export const InteractiveNoValue: Story = {
  render: (args) => {
    if (args.mode !== SelectCardMode.Input) return <></>;

    const inputArgs = args as SelectCardInputProps;
    const [value, setValue] = useState(inputArgs.value || '');

    return (
      <SelectCard
        {...inputArgs}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    id: 'username',
    label: 'Username',
    mode: SelectCardMode.Input,
    value: '',
    placeholder: 'eg. x.com/username',
  },
};

export const InteractiveOnlyValue: Story = {
  render: (args) => {
    if (args.mode !== SelectCardMode.Input) return <></>;

    const inputArgs = args as SelectCardInputProps;
    const [value, setValue] = useState(inputArgs.value || '');

    return (
      <SelectCard
        {...inputArgs}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    id: 'username',
    mode: SelectCardMode.Input,
    value: 'x.com/username',
    placeholder: 'eg. x.com/username',
  },
};
