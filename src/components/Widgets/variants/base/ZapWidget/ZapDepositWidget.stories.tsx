import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ZapDepositWidget } from './ZapDepositWidget';
import { TaskType } from 'src/types/strapi';
import { ConnectButton } from 'src/components/ConnectButton';

const meta = {
  component: ZapDepositWidget,
  title: 'Components/Side Widget/Zap Deposit',
  render: (args) => (
    <div>
      <ConnectButton />
      <div style={{ marginTop: '1rem' }}>
        <ZapDepositWidget {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof ZapDepositWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ZapDeposit: Story = {
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
