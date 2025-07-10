import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ZapWithdrawWidget } from './ZapWithdrawWidget';
import { TaskType } from 'src/types/strapi';

const meta = {
  component: ZapWithdrawWidget,
  title: 'Components/Side Widget/Zap Withdraw',
} satisfies Meta<typeof ZapWithdrawWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ZapWithdraw: Story = {
  args: {
    ctx: {
      taskType: TaskType.Zap,
    },
    customInformation: {
      projectData: {
        chain: 'base',
        address: '0xa900a17a49bc4d442ba7f72c39fa2108865671f0',
        chainId: 8453,
        project: 'ionic',
        integrator: 'zap.ionic',
      },
      claimingIds: [],
    },
  },
};
