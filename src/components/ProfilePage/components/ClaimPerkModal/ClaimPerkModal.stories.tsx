import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ClaimPerkModal } from './ClaimPerkModal';
import { Button } from 'src/components/Button';
import { action } from 'storybook/internal/actions';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { AvailableSteps } from './ClaimPerkModal.types';
import { ConnectButton } from 'src/components/ConnectButton';
import { useAccount } from '@lifi/wallet-management';
import { PerksDataAttributes } from 'src/types/strapi';

const meta = {
  component: ClaimPerkModal,
  title: 'Perks/Claim Perk Modal',
  argTypes: {},
} satisfies Meta<typeof ClaimPerkModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonArgs = {
  onClose: action('on-close'),
  isOpen: true,
  perkId: '1',
  permittedSteps: [AvailableSteps.Username, AvailableSteps.Wallet],
  stepProps: {
    [AvailableSteps.Username]: {
      usernameType: 'discord',
    },
  },
  nextStepsDescription: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'Please create a',
        },
        {
          type: 'text',
          text: 'perk',
          bold: true,
        },
        {
          type: 'text',
          text: 'ticket on our ',
        },
        {
          type: 'text',
          text: 'Discord',
          bold: true,
          content: {
            type: 'link',
            url: 'http://test.com',
            children: [
              {
                text: 'Discord',
              },
            ],
          },
        },
        {
          type: 'text',
          text: ' or reach out on ',
        },
        {
          type: 'text',
          text: 'Telegram',
          bold: true,
          content: {
            type: 'link',
            url: 'http://test.com',
            children: [
              {
                text: 'Telegram ',
              },
            ],
          },
        },
        {
          type: 'text',
          text: ', making sure to use the same username you have provided in the previous steps. We will share the perk with you within one week',
        },
      ],
    },
  ] as PerksDataAttributes['NextStepsDescription'],
  howToUsePerkDescription: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'Simply add the code we provide you in the checkout of the Nansen website.',
        },
      ],
    },
  ] as PerksDataAttributes['HowToUseDescription'],
  isClaimed: false,
};

export const Default: Story = {
  args: {
    ...commonArgs,
  },
};

export const WithToggleAndConnectButton: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClaimed, setIsClaimed] = useState(args.isClaimed);
    const { account } = useAccount();

    return (
      <Box sx={{ p: 2 }}>
        <ConnectButton />
        <Button onClick={() => setIsOpen(!isOpen)}>Claim Perk</Button>

        <ClaimPerkModal
          {...args}
          isClaimed={isClaimed}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          walletAddress={account?.address}
        />
      </Box>
    );
  },
  args: {
    ...commonArgs,
  },
};

export const WithSingleStep: Story = {
  args: {
    ...commonArgs,
    permittedSteps: [AvailableSteps.Wallet],
  },
};

export const WithClaimed: Story = {
  args: {
    ...commonArgs,
    isClaimed: true,
    walletAddress: '0x12122234567890123456789012345678901234567890',
  },
};
