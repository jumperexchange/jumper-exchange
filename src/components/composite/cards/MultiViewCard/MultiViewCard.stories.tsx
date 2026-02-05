import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MultiViewCard } from './MultiViewCard';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';

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
    tabs: [
      { label: 'Your positions', value: 'positions' },
      { label: 'Your yield', value: 'yield' },
    ],
    size: HorizontalTabSize.SM,
  },
};
