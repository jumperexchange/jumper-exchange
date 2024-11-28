import type { FaqProps } from 'src/components/AccordionFAQ';

export const useBerachainFaq = () => {
  const faqItems: FaqProps[] = [
    {
      Question: 'What is Berachain?',
      Answer:
        'Berachain is a next-generation blockchain platform designed to provide high scalability, low transaction costs, and enhanced security for decentralized applications and smart contracts.',
    },
    {
      Question: 'How does Berachain differ from other blockchain platforms?',
      Answer:
        'Berachain distinguishes itself through its innovative consensus mechanism: Proof of Liquidity (PoL). PoL aligns network security and liquidity by validators rewarding liquidity providers on Berachain with the non-purchasable staking token of the network.',
    },
    {
      Question: 'What types of applications can be built on Berachain?',
      Answer:
        'Berachain supports a wide range of decentralized applications (dApps), including but not limited to: DeFi Protocols, NFT projects, games and governance initiatives.',
    },
    {
      Question: 'How can I get started with Berachain development?',
      Answer: 'To start developing on Berachain, go to: berachain.com',
    },
  ];

  return faqItems;
};
