import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Percent } from './Percent';
import { PercentSize } from './Percent.types';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import { AvatarSize } from '../AvatarStack/AvatarStack.types';
import { Avatar } from '@mui/material';

const meta = {
  title: 'Core/Percent',
  component: Percent,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(PercentSize),
    },
  },
} satisfies Meta<typeof Percent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percent: 32,
    size: PercentSize.XXL,
  },
};

export const WithText: Story = {
  args: {
    percent: 32,
    size: PercentSize.XXL,
    children: '+2',
  },
};

export const WithChildren: Story = {
  args: {
    percent: 75,
    size: PercentSize.XXL,
    children: (
      <Avatar
        src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
        sx={{ width: 51.2, height: 51.2 }}
      />
    ),
  },
};

export const WithLongText: Story = {
  args: {
    percent: 32,
    size: PercentSize.XXL,
    children: '1121111232',
  },
};
