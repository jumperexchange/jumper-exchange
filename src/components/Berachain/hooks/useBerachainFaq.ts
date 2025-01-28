import type { FaqProps } from 'src/components/AccordionFAQ';

export const useBerachainFaq = () => {
  const faqItems: FaqProps[] = [
    {
      Question: 'What is Berachain?',
      Answer:
        'Berachain is a high-performance EVM-Identical Layer 1 (L1) blockchain utilizing Proof-of-Liquidity (PoL) as a consensus mechanism, and built on top of a modular evm-focused consensus client framework named BeaconKit.',
    },
    {
      Question: 'What is Boyco?',
      Answer: `Boyco is the term used for the pre-launch liquidity acquisition marketplaces that will be live prior to the Berachain mainnet launch, powered by Royco.

Boyco will allow applications to onboard liquidity directly into their smart contracts on their mainnet deployment, ensuring they can focus on building and creating within the Berachain ecosystem in the early days of deployment. It also ensures that LPs will have an easy way to shop around their liquidity to a variety of different protocols, with the ability to filter by different types of assets, durations of locks, types of applications, and return profiles.`,
    },
    {
      Question: 'What assets can I deposit?',
      Answer:
        'Users are able to deposit bluechip majors (wBTC, wETH), stablecoins (USDC, USDT, DAI, pyUSD and HONEY), along with some select LSTs.',
    },
    {
      Question: 'What will happen after Berachain mainnet Launch?',
      Answer: `When Berachain mainnet launches each application that is participating in Boyco will call their specific Boyco contract on Ethereum mainnet, which will automatically bridge the deposited funds via Layer-0 and deposit them into the pre-deposited pools on Berachain mainnet. As a Boyco depositor, there is nothing you will have to do at this stage to ensure your liquidity makes it to Berachain.`,
    },
    {
      Question: 'Are my funds locked?',
      Answer:
        'Yes, each Boyco market will be subject to a lock period once the funds are moved to Berachain mainnet. The lock period will be specified during the deposit process and users will be able to determine which market has the most optimal style for them (lock period, asset exposure, APR, etc). Once a deposit is made, funds will be locked until the end of the lock period. Please ensure you are happy to deposit into the market as your funds will be locked once the deposit is complete.',
    },
    {
      Question: 'What will be the rewards?',
      Answer:
        'Rewards will be provided by the dApps directly for each position they have advertised on Boyco. The rewards pay out will be similar to seasons in an airdrop, where all rewards will be paid in 1 lump sum at the end of the lock period. Due to the applications likely not having their tokens live on Berachain once the Boyco liquidity is bridged across, users will receive their token incentives at the conclusion of their pre-determined lock period.',
    },
    {
      Question:
        'How long will it take to get my reward and how will I receive them?',
      Answer:
        'Rewards will be paid to depositors at the conclusion of the pre-determined lock period and will be claimed from each dApp directly. Depositors will be provided a redirection link from the Jumper UI to each official claim page on the dApps UI where they can claim their incentives at the conclusion of the lock period.',
    },
    {
      Question: 'What are "Baffle" rewards?',
      Answer: `Baffle rewards are additional raffle rewards on top of the Boyco rewards offered by participating protocols exclusively to users who deposit into Boyco via Jumper. The rewards will be distributed through a raffle mechanism at the end of Boyco. To qualify for a protocols baffle you need to deposit and lock the minimum amount into any of their markets. More details about how to qualify can be found in the market’s description. All of those markets are recognisable by the 'Baffle' tag on the UI. List of all Baffle rewards: 25 HJ1 NFTs from The Honey Jar, 5 Big Fat Beras NFTs from Beraborrow, 5 Beary Benslers NFTs & 1 Bearet Yellens NFT from BurrBear, 6.9k USDC from Origami.`,
    },
  ];

  return faqItems;
};
