import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { Variant as ButtonVariant, Size as ButtonSize } from '../types';

const meta = {
  title: 'Core/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(ButtonSize).filter(
        (size) => size !== ButtonSize.XS,
      ),
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: ButtonVariant.Default,
    size: ButtonSize.MD,
    children: 'Button',
  },
};

export const AllVariants: Story = {
  args: {
    variant: ButtonVariant.Default,
    size: ButtonSize.MD,
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant={ButtonVariant.Default}>Default</Button>
      <Button variant={ButtonVariant.Primary}>Primary</Button>
      <Button variant={ButtonVariant.Secondary}>Secondary</Button>
      <Button variant={ButtonVariant.AlphaLight}>Alpha Light</Button>
      <Button variant={ButtonVariant.AlphaDark}>Alpha Dark</Button>
      <Button variant={ButtonVariant.LightBorder}>Light Border</Button>
      <Button variant={ButtonVariant.Disabled}>Disabled</Button>
      <Button variant={ButtonVariant.Borderless}>Borderless</Button>
      <Button variant={ButtonVariant.Success}>Success</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    variant: ButtonVariant.Primary,
    size: ButtonSize.MD,
    children: 'Button',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Button variant={ButtonVariant.Primary} size={ButtonSize.SM}>
        SM
      </Button>
      <Button variant={ButtonVariant.Primary} size={ButtonSize.MD}>
        MD
      </Button>
      <Button variant={ButtonVariant.Primary} size={ButtonSize.LG}>
        LG
      </Button>
      <Button variant={ButtonVariant.Primary} size={ButtonSize.XL}>
        XL
      </Button>
    </div>
  ),
};
