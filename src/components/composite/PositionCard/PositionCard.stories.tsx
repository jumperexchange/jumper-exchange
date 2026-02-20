import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PositionCard } from './PositionCard';
import { mockChainPositions, mockAppPositions } from './fixtures';

const meta: Meta<typeof PositionCard> = {
  title: 'components/composite/PositionCard',
  component: PositionCard,
  tags: ['autodocs'],
  argTypes: {
    positions: { table: { disable: true } },
    isLoading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

export const ChainPosition: StoryObj<typeof PositionCard> = {
  render: () => <PositionCard positions={mockChainPositions} />,
};

export const AppPosition: StoryObj<typeof PositionCard> = {
  render: () => <PositionCard positions={mockAppPositions} />,
};

export const Loading: StoryObj<typeof PositionCard> = {
  render: () => <PositionCard isLoading />,
};

export const Empty: StoryObj<typeof PositionCard> = {
  render: () => <PositionCard positions={[]} />,
};
