'use client';
import { Box, Typography, alpha } from '@mui/material';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { DynamicPagesContainer } from 'src/components/DynamicPagesContainer';

const SwapExplanationSection = () => {
  const faqData = [
    {
      Question: 'What are cryptocurrencies swaps?',
      Answer: `A swap is the exchange of one cryptocurrency for another, typically through a decentralized exchange (DEX) or automated market maker (AMM). Swaps bypass intermediaries, allowing users to trade tokens directly from their wallets. They're fast, cost-efficient and key to DeFi.`,
    },
    {
      Question: 'What is a swap aggregator?',
      Answer: `A swap aggregator in crypto connects to multiple decentralized exchanges (DEXs) to find the best rates for token swaps. It compares prices, fees, liquidity and slippage across platforms in real-time, often splitting trades for optimal results. This ensures users get the most value by saving time, reducing costs and maximizing tokens received in a single transaction.`,
    },
    {
      Question: 'Why use an aggregrator to do swaps in crypto?',
      Answer: `Using a swap aggregator in crypto ensures you get the best price by comparing rates across multiple swap providers (DEXs). Aggregators find the most efficient route, minimizing slippage and fees. They may split your trade across platforms for better outcomes. This saves time, reduces costs, and enhances liquidity access, offering more transparency and value than using a single provider.`,
    },
    {
      Question: 'Is it safe to swap cryptocurrencies?',
      Answer: `Swapping crypto can be safe if done on reputable platforms with audited smart contracts. Decentralized exchanges (DEXs) reduce custodial risks since users retain control of their assets. However, risks like hacks, smart contract bugs, or phishing scams exist. To stay safe, research the platform, check fees, and ensure you’re using official sites or wallets. Caution and due diligence are key.`,
    },
  ];
  return (
    <DynamicPagesContainer
      sx={() => ({
        width: '100%',
      })}
    >
      <AccordionFAQ
        accordionHeader={
          <Box sx={(theme) => ({ marginBottom: theme.spacing(2) })}>
            <Typography variant="h2">FAQ</Typography>
          </Box>
        }
        content={faqData}
        questionTextTypography="bodyLargeStrong"
        itemSx={(theme) => ({
          background: theme.palette.bgSecondary.main,
          boxShadow: theme.shadows[1],
          '&:hover': {
            background:
              theme.palette.mode === 'light'
                ? theme.palette.white.main
                : alpha(theme.palette.white.main, 0.16),
          },
        })}
      />
    </DynamicPagesContainer>
  );
};

export default SwapExplanationSection;
