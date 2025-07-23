import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Widget } from './Widget';
import { TaskType } from 'src/types/strapi';
import { ChainId, ChainKey } from '@lifi/sdk';

const meta = {
  component: Widget,
  title: 'Components/Side Widget/Base',
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    ctx: {
      taskType: TaskType.Bridge,
      destinationChain: {
        chainId: ChainId.ARB.toString(),
        chainKey: ChainKey.ARB.toUpperCase(),
      },
      destinationToken: {
        tokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        tokenSymbol: 'USDC',
      },
      sourceChain: {
        chainId: ChainId.ARB.toString(),
        chainKey: ChainKey.ARB.toUpperCase(),
      },
      sourceToken: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        tokenSymbol: 'ETH',
      },
      fromAmount: '100',
      //   toAddress: "",
    },
  },
};
