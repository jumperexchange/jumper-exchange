import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { ChainId } from '@lifi/types';

const NON_STABLE_BRIDGE = 10;
const STABLE_BRIDGE = 5;
const STABLE_SWAP = 2;
const NON_STABLE_SWAP = 5;

const SOLANA_STABLES = [
  'epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v',
  'es9vmfrzacermjfrf4h2fyd4kconky11mcce8benwnyb',
  '2b1kv6dkpanxd5ixfnxcpjxmkwqjjaymczfhsfu24gxo',
  'ejmyn6qec1tf1jxig1ae7utjhuxswk1tcwnwqxwv4j6o',
];

// add Frax, PYUSD, USDA, USDC.e
const EVM_STABLES = [
  //eth
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  '',
  //op
  '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
  '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
  //arb
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  '',
  //base
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
  '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
  '',
  //polygon
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  '',
  //polygon zkevm
  '',
  '',
  '',
  '',
  //bsc
  '',
  '',
  '',
  '',
  //avalanche
  '',
  '',
  '',
  '',
  //zksync
  '',
  '',
  '',
  '',
  //linea
  '',
  '',
  '',
  '',
];

export const useDeductedAmount = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  console.log(sourceChainToken);
  console.log(destinationChainToken);

  let amount = undefined;
  const srcTokenAddress = sourceChainToken?.tokenAddress?.toLowerCase();
  const dstTokenAddress = destinationChainToken?.tokenAddress?.toLowerCase();

  if (
    srcTokenAddress &&
    dstTokenAddress &&
    sourceChainToken?.chainId === ChainId.SOL &&
    destinationChainToken?.chainId === ChainId.SOL
  ) {
    if (
      SOLANA_STABLES.includes(srcTokenAddress) &&
      SOLANA_STABLES.includes(dstTokenAddress)
    ) {
      console.log('STABLE_BRIDGE');
      amount = STABLE_SWAP / 10000;
    } else if (
      SOLANA_STABLES.includes(srcTokenAddress) ||
      SOLANA_STABLES.includes(dstTokenAddress)
    ) {
      amount = NON_STABLE_SWAP / 10000;
    }
  } else if (
    srcTokenAddress &&
    dstTokenAddress &&
    (sourceChainToken?.chainId === ChainId.SOL ||
      destinationChainToken?.chainId === ChainId.SOL)
  ) {
    console.log('heree');
    console.log(srcTokenAddress);
    console.log(dstTokenAddress);
    console.log(
      SOLANA_STABLES.includes(srcTokenAddress) &&
        EVM_STABLES.includes(dstTokenAddress),
    );
    console.log(
      EVM_STABLES.includes(srcTokenAddress) &&
        SOLANA_STABLES.includes(dstTokenAddress),
    );
    if (
      (SOLANA_STABLES.includes(srcTokenAddress) &&
        EVM_STABLES.includes(dstTokenAddress)) ||
      (EVM_STABLES.includes(srcTokenAddress) &&
        SOLANA_STABLES.includes(dstTokenAddress))
    ) {
      console.log('STABLE_BRIDGE');
      amount = STABLE_BRIDGE / 10000;
    } else if (
      SOLANA_STABLES.includes(srcTokenAddress) ||
      SOLANA_STABLES.includes(dstTokenAddress) ||
      EVM_STABLES.includes(srcTokenAddress) ||
      EVM_STABLES.includes(dstTokenAddress)
    ) {
      console.log('NON_STABLE_BRIDGE');
      amount = NON_STABLE_BRIDGE / 10000;
    }
  }

  return {
    deductedAmount: amount,
  };
};
