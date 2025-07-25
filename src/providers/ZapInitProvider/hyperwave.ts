import { EVMAddress } from 'src/types/internal';
import { createPublicClient, defineChain, getContract, http } from 'viem';

interface GetMinimumMintParams {
  amount: bigint;
  token: EVMAddress;
  tokenDecimals: number;
}

// https://github.com/wevm/viem/pull/3803/files
// TODO: can we pull this out of the widget instead of duplicating code?
// It's officially supported in LIFI: https://docs.li.fi/introduction/chains
export const hyperevm = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HyperEVM', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVM Explorer',
      url: 'https://hyperevmscan.io/',
    },
  },
});

// TODO: below const are hardcoded, will load them from the backend once I get a tx working.
const accountantAddr =
  '0x78e3ac5bf48dcaf1835e7f9861542c0d43d0b03e' as EVMAddress;

const accountantAbi = {
  getRateInQuoteSafe: {
    inputs: [
      {
        name: 'quote',
        type: 'address',
      },
    ],
    name: 'getRateInQuoteSafe',
    outputs: [
      {
        name: 'rateInQuote',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
}; // helpers.hyperevm.accountant.abi

export const getMinimumMint = async ({
  amount,
  token,
  tokenDecimals,
}: GetMinimumMintParams): Promise<number> => {
  // Reference: https://swellnetwork.notion.site/hwHLP-Integration-Documentation-External-23011e01a88380bbb72dc73190728fde#23011e01a8838008ae07f9c1538bdcf1:~:text=receive%20hwHLP%20tokens.-,Step%201%3A%20Calculate%20Minimum%20Mint%20Amount,-First%2C%20you%20need
  const client = createPublicClient({
    chain: hyperevm,
    transport: http(),
  });

  const contract = getContract({
    address: accountantAddr,
    abi: Object.values(accountantAbi),
    client,
  });

  const rate = await contract.read.getRateInQuoteSafe([token]);

  if (!rate || typeof rate !== 'bigint') {
    throw new Error('Failed to get rate');
  }

  // Contrived big number division (10000001 / 10 = 10000000 / 10 + 1 / 10)
  // TODO: how do we deal with these usually? Decimal.js?
  const numerator = amount * 10n ** BigInt(tokenDecimals);
  const denominator = rate;
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  return Number(quotient) + Number(remainder) / Number(denominator);
};
