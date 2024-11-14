import type { FaqProps } from 'src/components/AccordionFAQ';

export const useBerachainFaq = () => {
  const faqItems: FaqProps[] = [
    {
      Question: 'What is BeraChain?',
      Answer:
        'BeraChain is a next-generation blockchain platform designed to provide high scalability, low transaction costs, and enhanced security for decentralized applications and smart contracts.',
    },
    {
      Question: 'How does BeraChain differ from other blockchain platforms?',
      Answer:
        'BeraChain distinguishes itself through its innovative consensus mechanism, which combines the best aspects of Proof of Stake and Proof of Work. This hybrid approach allows for faster transaction processing and improved energy efficiency compared to traditional blockchain networks.',
    },
    {
      Question: 'What types of applications can be built on BeraChain?',
      Answer:
        'BeraChain supports a wide range of decentralized applications (dApps), including but not limited to:',
    },
    {
      Question: 'How can I get started with BeraChain development?',
      Answer: 'To start developing on BeraChain, follow these steps:',
    },
  ];

  return faqItems;
};
