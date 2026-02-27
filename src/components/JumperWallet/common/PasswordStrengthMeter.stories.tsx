import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

const meta = {
  title: 'JumperWallet/Common/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
    },
  },
} satisfies Meta<typeof PasswordStrengthMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Weak: Story = {
  args: { score: 0, label: 'Weak' },
};

export const Fair: Story = {
  args: { score: 1, label: 'Fair' },
};

export const Good: Story = {
  args: { score: 2, label: 'Good' },
};

export const Strong: Story = {
  args: { score: 3, label: 'Strong' },
};

export const VeryStrong: Story = {
  args: { score: 4, label: 'Very Strong' },
};

export const AllStrengths: Story = {
  args: { score: 0, label: '' },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}
    >
      <PasswordStrengthMeter score={0} label="Weak" />
      <PasswordStrengthMeter score={1} label="Fair" />
      <PasswordStrengthMeter score={2} label="Good" />
      <PasswordStrengthMeter score={3} label="Strong" />
      <PasswordStrengthMeter score={4} label="Very Strong" />
    </div>
  ),
};
