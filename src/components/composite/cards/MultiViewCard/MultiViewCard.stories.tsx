import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MultiViewCard } from './MultiViewCard';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import Typography from '@mui/material/Typography';
import {
  commonArgs,
  withHeaderContentArgs,
  withContentArgs,
  withHeaderArgs,
} from './fixtures';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import { Variant } from '@/components/core/buttons/types';

const meta = {
  title: 'components/composite/cards/MultiViewCard',
  component: MultiViewCard,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: Object.values(HorizontalTabSize),
    },
  },
} satisfies Meta<typeof MultiViewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...commonArgs,
  },
};

export const WithContent: Story = {
  args: withContentArgs,
};

export const WithHeader: Story = {
  args: withHeaderArgs,
};

export const WithHeaderContent: Story = {
  args: withHeaderContentArgs,
};
